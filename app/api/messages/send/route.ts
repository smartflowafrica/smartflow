import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendMessageSchema } from '@/lib/schemas/message';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

const prisma = new PrismaClient();
const whatsapp = new WhatsAppService();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation
        const result = sendMessageSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues }, { status: 400 });
        }

        const { clientId, customerPhone, customerName, messageText, category } = result.data;

        // 1. Send via WhatsApp (Evolution API)
        let deliveryStatus = 'PENDING';
        try {
            await whatsapp.sendMessage(customerPhone, messageText, clientId);
            deliveryStatus = 'SENT';
        } catch (wsError) {
            console.error('WhatsApp Send Failed:', wsError);
            deliveryStatus = 'FAILED_TO_SEND';
            // Continue to save to DB so it's logged
        }

        // 2. Transaction to ensure Customer exists and Message is logged
        const message = await prisma.$transaction(async (tx) => {
            // Upsert Customer
            let customer = await tx.customer.findUnique({
                where: {
                    clientId_phone: {
                        clientId,
                        phone: customerPhone,
                    },
                },
            });

            if (!customer) {
                customer = await tx.customer.create({
                    data: {
                        clientId,
                        phone: customerPhone,
                        name: customerName || 'New Customer',
                        preferredContact: 'whatsapp',
                    },
                });
            }

            // Create Message
            const newMessage = await tx.message.create({
                data: {
                    clientId,
                    customerPhone,
                    customerName: customer.name,
                    messageText,
                    category,
                    handledBy: 'HUMAN',
                    status: deliveryStatus === 'SENT' ? 'COMPLETED' : 'FAILED',
                },
            });

            return newMessage;
        });

        return NextResponse.json({
            success: deliveryStatus === 'SENT',
            data: message,
            deliveryStatus
        });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: (error as Error).message },
            { status: 500 }
        );
    }
}
