import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';
import { RateLimiter } from '@/lib/services/rate-limiter';
import { globalLimiter } from '@/lib/rate-limit';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Security: IP-based Rate Limiting (DoS Protection)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        try {
            await globalLimiter.consume(ip);
        } catch (rlError) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const jobId = params.id;

        // No strict auth required here as this is a public payment page action
        // However, we should validate the Job exists and has a customer phone

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                client: {
                    include: { integrations: true }
                },
                customer: true
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const customerPhone = job.customerPhone;
        const customerName = job.customerName;
        const businessName = job.client.businessName;

        if (!customerPhone) {
            return NextResponse.json({ error: 'Customer phone not found' }, { status: 400 });
        }

        // 2. Security: Recipient-based Rate Limiting (Spam Protection)
        const rateLimiter = new RateLimiter();
        const { allowed, waitMs } = await rateLimiter.canSend(customerPhone);

        if (!allowed) {
            console.warn(`[Security] Rate limit exceeded for ${customerPhone}`);
            // Fail silently or with generic message to avoid leaking info, but for UX we might want to be honest
            // Since this is triggered by user button click, we can be honest.
            return NextResponse.json({
                error: `Please wait ${Math.ceil((waitMs || 0) / 60000)} minutes before requesting again.`
            }, { status: 429 });
        }

        // Friendly / Smart Conversation Logic
        const message = `Hi ${customerName}! 👋\n\nThanks for initiating the transfer for ${businessName}.\n\nCould you please help us by uploading your proof of payment (screenshot/receipt) right here? 📸\n\nThis will help us confirm your payment faster. Thank you!`;

        try {
            // Use Client's specific WhatsApp Instance
            const instanceId = job.client.integrations?.whatsappInstanceId;
            const whatsapp = new WhatsAppService(instanceId || undefined);

            console.log(`[Confirm Transfer] Sending request to ${customerPhone} via instance ${instanceId || 'DEFAULT'}`);

            await whatsapp.sendMessage(customerPhone, message, job.clientId);

            // Record usage for rate limiter
            await rateLimiter.recordSend(customerPhone, 'PAYMENT_PROOF_REQUEST');

            // Log interaction
            await prisma.message.create({
                data: {
                    clientId: job.clientId,
                    customerPhone: customerPhone,
                    customerName: customerName,
                    messageText: message,
                    handledBy: 'BOT',
                    status: 'COMPLETED',
                    category: 'PAYMENT_PROOF_REQUEST'
                }
            });

        } catch (wsError) {
            console.error('WhatsApp Send Failed (Proof Request):', wsError);
            // Don't fail the request to the UI, but log it
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Confirm Transfer Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
