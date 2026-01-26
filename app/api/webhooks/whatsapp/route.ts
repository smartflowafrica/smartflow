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

        const { from, to, message, name, sid, instanceId } = parsed;
        console.log(`[Evolution Webhook] Instance: ${instanceId} | From: ${from} | Msg: ${message}`);

        // Generate phone variants for matching (International vs Local)
        const phoneVariants = [
            from, // +234...
            from.replace(/^\+234/, '0'), // 080...
            from.replace(/^\+/, '') // 234...
        ];

        // 3. Identify Client
        let client: any = null;

        // Priority 1: Exact Instance Match (Multi-Tenancy)
        if (instanceId) {
            const clientWithIntegration = await prisma.client.findFirst({
                where: {
                    integrations: {
                        whatsappInstanceId: instanceId
                    }
                },
                include: { integrations: true }
            });
            if (clientWithIntegration) {
                client = clientWithIntegration;
                console.log(`[Webhook] Client resolved via Instance ID (${instanceId}): ${client.businessName}`);
            }
        }

        // Priority 2: Check if 'To' matches a Client's configured WhatsApp number (Legacy/Fallback)
        if (!client) {
            const clientWithNumber = await prisma.client.findFirst({
                where: {
                    integrations: {
                        whatsappNumber: {
                            contains: to.replace('+', '') // Evolution uses clean numbers usually
                        }
                    }
                },
                include: { integrations: true }
            });
            if (clientWithNumber) {
                client = clientWithNumber;
            }
        }

        let resolvedCustomer: any = null;

        // Priority 3: Fallback (Sandbox/Dev) - Find Customer by 'From' number
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

        // Initialize Service for REPLYING using the correct instance
        // Use the instanceId from webhook if available, else from DB, else default
        const replyInstanceName = instanceId || client.integrations?.whatsappInstanceId;
        const replyWhatsapp = new WhatsAppService(replyInstanceName);

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

        let isWakeWord = false; // Lifted scope for access later

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
            isWakeWord = true; // New conversations are active
        } else {
            // Update existing conversation
            const lowerMsg = message?.toLowerCase() || '';
            // Wake words now include Intents (book, price, service) to auto-recover from NEEDS_HUMAN
            isWakeWord = /^(hi|hello|hey|good|start|reset|menu|test|book|price|cost|service|status|help)/.test(lowerMsg);

            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    status: (conversation.status === 'RESOLVED' || isWakeWord) ? 'ACTIVE' : conversation.status,
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
                conversationId: conversation.id,
                metadata: {
                    instanceId: instanceId // Store technical metadata
                }
            }
        });

        console.log(`[Webhook] Message processed for ${client.businessName} (Conv ID: ${conversation.id})`);

        // 6. Process with Bot (Auto-Reply)
        // Only if conversation status is ACTIVE (Bot active)
        // Fix: If isWakeWord, we just set status to ACTIVE in DB, but local 'conversation' object is stale.
        // We must consider isWakeWord to allow immediate reply.

        let shouldProcessBot = conversation.status === 'ACTIVE';
        if (isWakeWord) shouldProcessBot = true;

        if (shouldProcessBot) {
            const processor = new MessageProcessor();

            // Only pass name if it's not the default placeholder
            const validName = customer.name && customer.name !== 'New WhatsApp Lead' ? customer.name : undefined;
            const result = await processor.processMessage(message, from, client.id, validName);

            if ((result.action === 'reply' || result.action === 'escalate') && result.response) {
                // Send Reply via WhatsApp (Evolution) USING CORRECT INSTANCE
                if (result.mediaUrls && result.mediaUrls.length > 0) {
                    await replyWhatsapp.sendMedia(from, result.mediaUrls[0], result.response, client.id);
                } else {
                    await replyWhatsapp.sendMessage(from, result.response, client.id);
                }

                // Auto-Switch to Human if low confidence OR explicit escalate action
                if (result.confidence < 50 || result.action === 'escalate') {
                    console.log(`[Webhook] Escalating to HUMAN (Reason: ${result.action === 'escalate' ? 'Explicit Action' : 'Low Confidence'})`);
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
