import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = params;

        const sector = await prisma.businessSector.findUnique({
            where: { code: code.toLowerCase() }
        });

        if (!sector) {
            return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
        }

        return NextResponse.json(sector);
    } catch (error) {
        console.error('Error fetching sector:', error);
        return NextResponse.json({ error: 'Failed to fetch sector' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { code: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (dbUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { code } = params;
        const body = await request.json();
        const { name, icon, color, config } = body;

        const updatedSector = await prisma.businessSector.update({
            where: { code: code.toLowerCase() },
            data: { name, icon, color, config }
        });

        return NextResponse.json(updatedSector);
    } catch (error) {
        console.error('Error updating sector:', error);
        return NextResponse.json({ error: 'Failed to update sector' }, { status: 500 });
    }
}
