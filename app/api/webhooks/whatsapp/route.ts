import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp'; // Switched to Evolution
import { MessageProcessor } from '@/lib/bot/message-processor';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

// Initialize service
const whatsapp = new WhatsAppService();

export async function POST(req: Request) {
    try {
        // 1. Get JSON Payload (Evolution sends JSON)
        const body = await req.json();

        // DEBUG LOGGING
        const fs = require('fs');
        fs.appendFileSync('webhook-debug.log', JSON.stringify(body, null, 2) + '\n---\n');

        // 2. Parse via Service
        const parsed = await whatsapp.handleIncomingWebhook(body);

        // If parsed is null (e.g. check status update or outbound msg), ignore
        if (!parsed) {
            return NextResponse.json({ status: 'ignored' });
        }

        const { from, to, message, name, sid } = parsed;
        console.log(`[Evolution Webhook] From: ${from} | Msg: ${message}`);

        // Generate phone variants for matching (International vs Local)
        const phoneVariants = [
            from, // +234...
            from.replace(/^\+234/, '0'), // 080...
            from.replace(/^\+/, '') // 234...
        ];

        // 3. Identify Client
        // Priority 1: Check if 'To' matches a Client's configured WhatsApp number (Multi-tenancy)
        const clientWithIntegration = await prisma.client.findFirst({
            where: {
                integrations: {
                    whatsappNumber: {
                        contains: to.replace('+', '') // Evolution uses clean numbers usually
                    }
                }
            },
            include: { integrations: true }
        });

        let client = clientWithIntegration;
        let resolvedCustomer: any = null;

        // Priority 2: Fallback (Sandbox/Dev) - Find Customer by 'From' number
        // This assumes the customer is unique or we just take the last active context
        if (!client) {
            const customerWithClient = await prisma.customer.findFirst({
                where: { phone: { in: phoneVariants } },
                include: { client: { include: { integrations: true } } },
                orderBy: { lastVisit: 'desc' }
            });
            if (customerWithClient?.client) {
                client = customerWithClient.client;
                resolvedCustomer = customerWithClient;
                console.log(`[Webhook] Client resolved via Customer lookup: ${client.businessName}`);
            }
        }

        if (!client) {
            console.warn(`[Webhook] Unclaimed message. From: ${from}. Ignoring.`);
            return NextResponse.json({ status: 'unclaimed' });
        }

        // 4. Manage Conversation & Customer
        // Ensure Customer exists for this identified Client
        let customer: any = resolvedCustomer;

        if (!customer) {
            // Search for existing customer using variants
            customer = await prisma.customer.findFirst({
                where: {
                    clientId: client.id,
                    phone: { in: phoneVariants }
                }
            });
        }

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    clientId: client.id,
                    phone: from, // Default to incoming format for new
                    name: name || 'New WhatsApp Lead',
                    firstVisit: new Date(),
                    totalVisits: 1,
                    preferredContact: 'whatsapp'
                }
            });
        }

        if (!customer) throw new Error('Failed to resolve customer');

        // Find or Create Conversation
        let conversation = await prisma.conversation.findUnique({
            where: {
                clientId_customerPhone: {
                    clientId: client.id,
                    customerPhone: from
                }
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    clientId: client.id,
                    customerPhone: from,
                    customerName: customer.name,
                    status: 'ACTIVE',
                    unreadCount: 1,
                    lastMessageAt: new Date()
                }
            });
        } else {
            // Update existing conversation
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    status: conversation.status === 'RESOLVED' ? 'ACTIVE' : conversation.status,
                    unreadCount: { increment: 1 },
                    lastMessageAt: new Date(),
                    customerName: name || conversation.customerName
                }
            });
        }

        // 5. Save User Message
        await prisma.message.create({
            data: {
                clientId: client.id,
                customerPhone: from,
                customerName: customer.name,
                messageText: message,
                handledBy: 'HUMAN',
                status: 'COMPLETED',
                category: 'inquiry',
                conversationId: conversation.id
            }
        });

        console.log(`[Webhook] Message processed for ${client.businessName} (Conv ID: ${conversation.id})`);

        // 6. Process with Bot (Auto-Reply)
        // Only if conversation status is ACTIVE (Bot active)
        if (conversation.status === 'ACTIVE') {
            const processor = new MessageProcessor();
            const result = await processor.processMessage(message, from, client.id);

            if (result.action === 'reply' && result.response) {
                // Send Reply via WhatsApp (Evolution)
                if (result.mediaUrl) {
                    await whatsapp.sendMedia(from, result.mediaUrl, result.response, client.id);
                } else {
                    await whatsapp.sendMessage(from, result.response, client.id);
                }

                if (result.confidence < 50) {
                    await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { status: 'NEEDS_HUMAN' }
                    });
                }
            }
        }

        return NextResponse.json({ status: 'success' });

    } catch (error: any) {
        console.error('[Webhook] Critical Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
