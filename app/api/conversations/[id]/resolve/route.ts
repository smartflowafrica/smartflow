import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const conversation = await prisma.conversation.update({
            where: { id: params.id },
            data: {
                status: 'RESOLVED',
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, data: conversation });
    } catch (error) {
        console.error('Resolution Error:', error);
        return NextResponse.json({ error: 'Failed to resolve conversation' }, { status: 500 });
    }
}
