import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { initializePaystackPayment } from '@/lib/paystack';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const jobId = params.id;
        if (!jobId) return NextResponse.json({ error: 'Job ID required' }, { status: 400 });

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

        const amountToPay = job.finalAmount || job.price;

        if (!amountToPay || amountToPay <= 0) {
            return NextResponse.json({ error: 'Invalid job amount' }, { status: 400 });
        }

        const amountInKobo = amountToPay * 100;
        const customerEmail = job.customer?.email || job.client.email;

        // Use Client's Paystack Key if available, otherwise fall back to global (or fail if strict)
        // ideally we should probably fail if client hasn't set it up, but for now we fallback or use theirs.
        const clientPaystackKey = job.client.integrations?.paystackSecretKey;

        // If we want to enforce client key:
        // if (!clientPaystackKey) return NextResponse.json({ error: 'Payment gateway not configured for this business' }, { status: 400 });

        const paymentData = await initializePaystackPayment({
            email: customerEmail,
            amount: amountInKobo,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?type=job&id=${jobId}`,
            metadata: {
                jobId: job.id,
                clientId: job.clientId,
                type: 'JOB_PAYMENT',
                customerId: job.customerId
            }
        }, clientPaystackKey || undefined);

        await prisma.jobPayment.create({
            data: {
                jobId: job.id,
                clientId: job.clientId,
                amount: amountInKobo,
                reference: paymentData.data.reference,
                status: 'pending',
                currency: 'NGN'
            }
        });

        return NextResponse.json({
            paymentUrl: paymentData.data.authorization_url,
            reference: paymentData.data.reference
        });

    } catch (error: any) {
        console.error('Job Payment Init Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
