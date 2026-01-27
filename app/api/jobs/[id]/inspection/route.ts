import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInspectionPDF } from '@/lib/services/inspection-generator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const jobId = params.id;
        const body = await req.json();
        const { items, notes } = body;

        console.log(`[Inspection] Starting submission for Job ${jobId}`);

        // 1. Update Job with Inspection Data
        console.log('[Inspection] Updating DB...');
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                inspectionData: { items, notes },
            }
        });
        console.log('[Inspection] DB Updated.');

        // 2. Generate PDF
        console.log('[Inspection] Generating PDF...');
        const { base64, filename } = await generateInspectionPDF(jobId, { items, notes });
        console.log('[Inspection] PDF Generated.');

        // 3. Send WhatsApp Message
        console.log('[Inspection] Sending WhatsApp...');

        try {
            // Try native WhatsApp Service first (Evolution API)
            const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
            const whatsapp = new WhatsAppService();
            const isConnected = await whatsapp.isConnected(updatedJob.clientId);

            if (isConnected) {
                console.log('[Inspection] Using Native WhatsApp Service...');
                await whatsapp.sendMedia(
                    updatedJob.customerPhone,
                    base64,
                    `🚗 Vehicle Inspection Report for ${updatedJob.customerName}\n\nOur mechanic has completed the checkout. Please see the attached report for details.`,
                    updatedJob.clientId,
                    'document',
                    filename
                );
                console.log('[Inspection] WhatsApp Sent (Native).');
            } else {
                // Fallback to n8n if available
                const integration = await prisma.integration.findUnique({
                    where: { clientId: updatedJob.clientId }
                });

                if (integration?.n8nWebhookUrl) {
                    console.log('[Inspection] Using n8n Webhook...');
                    await fetch(integration.n8nWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'send_media',
                            phone: updatedJob.customerPhone,
                            file: base64,
                            filename: filename,
                            caption: `🚗 Vehicle Inspection Report for ${updatedJob.customerName}\n\nOur mechanic has completed the checkout. Please see the attached report for details.`
                        })
                    });
                    console.log('[Inspection] WhatsApp Sent (n8n).');
                } else {
                    console.log('[Inspection] No WhatsApp connection or Webhook found.');
                }
            }
        } catch (wsError) {
            console.error('[Inspection] WhatsApp Error:', wsError);
        }

        return NextResponse.json({ success: true, message: 'Inspection processed' });

    } catch (error: any) {
        console.error('[Inspection] FATAL ERROR:', error);
        // Log the full error stack if possible
        if (error.stack) console.error(error.stack);
        return NextResponse.json({ error: error.message || 'Internal Server Error', details: error.toString() }, { status: 500 });
    }
}
