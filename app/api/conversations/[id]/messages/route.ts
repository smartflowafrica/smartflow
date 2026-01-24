import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

const whatsapp = new WhatsAppService();

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
        const { clientId, text } = body;
        const conversationId = params.id;

        if (!text || !clientId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { client: true }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const customerPhone = conversation.customerPhone;

        let wsStatus = 'PENDING';
        try {
            await whatsapp.sendMessage(customerPhone, text, clientId);
            wsStatus = 'SENT';
        } catch (wsError) {
            console.error('WhatsApp Send Failed:', wsError);
            wsStatus = 'FAILED_TO_SEND';
        }

        const message = await prisma.message.create({
            data: {
                clientId,
                customerPhone,
                customerName: conversation.customerName || 'Customer',
                messageText: text,
                handledBy: 'HUMAN',
                status: 'COMPLETED',
                category: 'support',
                conversationId: conversation.id,
            }
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date(),
                status: 'HUMAN_HANDLING'
            }
        });

        return NextResponse.json({ success: true, data: message, deliveryStatus: wsStatus });

    } catch (error) {
        console.error('Send Message Error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
