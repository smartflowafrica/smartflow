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

        const body = await request.json();
        const { toAgentId, toAgentName } = body;
        const newAgent = toAgentName || toAgentId;

        if (!newAgent) {
            return NextResponse.json({ error: 'Target agent required' }, { status: 400 });
        }

        const conversation = await prisma.conversation.update({
            where: { id: params.id },
            data: {
                assignedTo: newAgent,
                status: 'HUMAN_HANDLING',
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, data: conversation });
    } catch (error) {
        console.error('Transfer Error:', error);
        return NextResponse.json({ error: 'Failed to transfer conversation' }, { status: 500 });
    }
}
