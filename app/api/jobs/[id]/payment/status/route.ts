import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPaystackPayment } from '@/lib/paystack';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const jobId = params.id;

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { paymentStatus: true, finalAmount: true }
        });

        if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

        // If already paid, return early
        if (job.paymentStatus === 'PAID') {
            return NextResponse.json({ status: 'PAID', amount: job.finalAmount });
        }

        // Check for pending payments
        const pendingPayment = await prisma.jobPayment.findFirst({
            where: { jobId, status: 'pending' },
            orderBy: { createdAt: 'desc' }
        });

        if (pendingPayment) {
            // Check status with Paystack
            try {
                const data = await verifyPaystackPayment(pendingPayment.reference);
                if (data.status === 'success') {
                    // Update DB (similar to webhook logic)
                    await prisma.jobPayment.update({
                        where: { id: pendingPayment.id },
                        data: { status: 'success', paidAt: new Date(data.paid_at) }
                    });
                    await prisma.job.update({
                        where: { id: jobId },
                        data: { paymentStatus: 'PAID', finalAmount: data.amount / 100 } // Amount from paystack is kobo
                    });

                    return NextResponse.json({ status: 'PAID', amount: data.amount / 100 });
                }
            } catch (err) {
                // Ignore verification error, just return current db status
            }
        }

        return NextResponse.json({ status: job.paymentStatus });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}
