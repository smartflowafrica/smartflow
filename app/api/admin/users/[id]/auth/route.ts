import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Check if auth user is admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify admin role
        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (adminUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const userId = params.id;
        const { password } = await request.json();

        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // 2. Fetch the user from Prisma
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.email) {
            return NextResponse.json({ error: 'User not found or email missing' }, { status: 404 });
        }

        // 3. Hash the password and update user
        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        // Log the action
        await prisma.systemLog.create({
            data: {
                level: 'INFO',
                message: `Password updated for user ${user.email} by Admin`,
                clientId: user.clientId
            }
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error managing auth:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
