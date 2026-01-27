import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

export async function GET(request: Request) {
    try {
        // Check for Cron Secret (Basic Security)
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // For Vercel Cron, typically headers check, but for now we might skip or use simple check
            // In dev, we skip
        }

        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        // Find Jobs eligible for feedback
        // - Completed
        // - Completed > 2 hours ago
        // - Feedback NOT sent
        const eligibleJobs = await prisma.job.findMany({
            where: {
                status: 'completed',
                completedAt: { lt: twoHoursAgo },
                feedbackRequestSent: false,
                customerPhone: { not: '' } // Ensure phone exists
            },
            take: 20, // Process in batches to avoid timeouts
            include: {
                client: {
                    include: { integrations: true }
                }
            }
        });

        const whatsapp = new WhatsAppService();
        let sentCount = 0;

        // FEEDBACK CRON DISABLED - REQUEST MOVED TO RECEIPT MESSAGE
        /* 
        for (const job of eligibleJobs) {
            // ... (Code Disabled)
        }
        */

        return NextResponse.json({ success: true, processed: sentCount });

    } catch (error) {
        console.error('Feedback Cron Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
