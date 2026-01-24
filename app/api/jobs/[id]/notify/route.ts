import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const jobId = params.id;
        const body = await request.json();
        const { messageType = 'ready' } = body;

        // Get job with customer details
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                customer: true,
                client: {
                    select: { businessName: true }
                }
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Compose message based on type
        let message = '';
        switch (messageType) {
            case 'ready':
                message = `Hello ${job.customerName}! 🚗\n\nYour car is now ready for pickup at ${job.client?.businessName || 'our shop'}.\n\nJob: ${job.description}\n\nPlease call us or visit to collect your vehicle. Thank you for choosing us!`;
                break;
            case 'update':
                message = `Hi ${job.customerName}, update on your car:\n\nJob: ${job.description}\nStatus: ${job.status}\n\nWe'll notify you when it's ready. Thanks!`;
                break;
            case 'invoice':
                const amount = job.price || job.finalAmount || 0;
                message = `Hi ${job.customerName},\n\nYour invoice is ready:\nJob: ${job.description}\nAmount: ₦${amount.toLocaleString()}\n\nPay online or visit us. Thank you!`;
                break;
            default:
                message = `Hello ${job.customerName}, this is an update regarding your car at ${job.client?.businessName}. Please contact us for more details.`;
        }

        // Send via WhatsApp
        const whatsapp = new WhatsAppService();
        await whatsapp.sendMessage(job.customerPhone, message, job.clientId);

        return NextResponse.json({
            success: true,
            message: 'Notification sent successfully'
        });

    } catch (error: any) {
        console.error('Notify Customer Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send notification' },
            { status: 500 }
        );
    }
}
