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
        const { agentId, agentName } = body;

        if (!agentId && !agentName) {
            return NextResponse.json({ error: 'Agent identifier required' }, { status: 400 });
        }

        const assignedValue = agentName || agentId;

        const conversation = await prisma.conversation.update({
            where: { id: params.id },
            data: {
                status: 'HUMAN_HANDLING',
                assignedTo: assignedValue,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, data: conversation });
    } catch (error) {
        console.error('Assignment Error:', error);
        return NextResponse.json({ error: 'Failed to assign conversation' }, { status: 500 });
    }
}
