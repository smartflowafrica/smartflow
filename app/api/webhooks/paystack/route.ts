import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) return NextResponse.json({ error: 'Config missing' }, { status: 500 });

        const signature = request.headers.get('x-paystack-signature');
        if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 });

        const body = await request.text();
        const hash = crypto.createHmac('sha512', secretKey).update(body).digest('hex');

        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);

        if (event.event === 'charge.success') {
            const { reference, metadata, paid_at, channel, amount } = event.data;

            // 1. Handle Client Subscription Payment
            if (metadata?.type === 'SUBSCRIPTION_PAYMENT') {
                const payment = await prisma.subscriptionPayment.findUnique({
                    where: { reference },
                });

                if (payment && payment.status !== 'success') {
                    await prisma.subscriptionPayment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'success',
                            paidAt: new Date(paid_at),
                            paymentMethod: channel,
                        },
                    });

                    const client = await prisma.client.findUnique({
                        where: { id: payment.clientId }
                    });

                    if (client) {
                        const currentNextBilling = client.nextBillingDate && client.nextBillingDate > new Date()
                            ? client.nextBillingDate
                            : new Date();

                        const newNextBilling = new Date(currentNextBilling);
                        newNextBilling.setMonth(newNextBilling.getMonth() + 1);

                        await prisma.client.update({
                            where: { id: payment.clientId },
                            data: {
                                nextBillingDate: newNextBilling,
                                status: 'ACTIVE'
                            }
                        });
                    }
                }
            }

            // 2. Handle Commitment Fee Payment (Appointments)
            else if (metadata?.type === 'COMMITMENT_FEE') {
                const appointmentId = metadata.appointmentId;
                if (appointmentId) {
                    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });

                    if (appointment && appointment.status === 'PENDING_PAYMENT') {
                        await prisma.appointment.update({
                            where: { id: appointmentId },
                            data: {
                                status: 'CONFIRMED',
                                notes: (appointment.notes || '') + `\n[PAID] Commitment Fee: ₦${(amount / 100).toLocaleString()}`,
                            }
                        });

                        // Send WhatsApp Confirmation
                        try {
                            const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
                            const whatsapp = new WhatsAppService();
                            const msg = `Payment Received! ✅\n\nYour appointment for ${new Date(appointment.date).toDateString()} at ${appointment.time} is now CONFIRMED.\n\nWe look forward to seeing you!`;
                            await whatsapp.sendMessage(appointment.customerPhone, msg, appointment.clientId);
                        } catch (wsError) {
                            console.error('WhatsApp notification failed (commitment fee):', wsError);
                        }
                    }
                }
            }

            // 3. Handle Job Payment
            else if (metadata?.type === 'JOB_PAYMENT') {
                const payment = await prisma.jobPayment.findUnique({ where: { reference } });

                if (payment && payment.status !== 'success') {
                    await prisma.jobPayment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'success',
                            paidAt: new Date(paid_at),
                            paymentMethod: channel,
                        },
                    });

                    const job = await prisma.job.update({
                        where: { id: payment.jobId },
                        data: {
                            paymentStatus: 'PAID',
                            finalAmount: amount,
                            status: 'completed',
                            completedAt: new Date()
                        },
                        include: { client: { select: { businessName: true } } }
                    });

                    try {
                        // Generate Receipt PDF
                        const { generateInvoicePDF } = await import('@/lib/services/invoice-generator');
                        const pdfData = await generateInvoicePDF(job.id, 'receipt', 'Online Payment');

                        const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
                        const whatsapp = new WhatsAppService();
                        const amountPaid = amount / 100;
                        const receiptMessage = `Payment Received! ✅

Thank you, ${job.customerName}! Your payment has been confirmed.

💰 Amount: ₦${amountPaid.toLocaleString()}
📋 Service: ${job.description}
🔖 Job ID: ${job.id.slice(0, 8).toUpperCase()}

📄 *Please see the attached Receipt.*

Thank you for choosing ${job.client?.businessName || 'us'}!`;

                        await whatsapp.sendMedia(
                            job.customerPhone,
                            pdfData.base64,
                            receiptMessage,
                            job.clientId,
                            'document'
                        );
                    } catch (wsError) {
                        console.error('WhatsApp notification failed (payment):', wsError);
                    }
                }
            }
        }
    }

    return NextResponse.json({ received: true });

} catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
}
