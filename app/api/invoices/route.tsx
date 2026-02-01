import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import { sendEmail } from '@/lib/services/mail';

export async function POST(request: Request) {
    try {
        const { jobId } = await request.json();
        if (!jobId) return NextResponse.json({ error: 'Job ID required' }, { status: 400 });

        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                client: {
                    include: {
                        branding: true,
                        integrations: true
                    }
                },
                customer: true
            }
        });

        if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

        const amount = job.finalAmount || job.price || 0;
        const businessName = job.client.businessName;
        const jobDesc = job.description;
        const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/payment/pay/${job.id}`;

        let logoUrl = job.client.branding?.logoUrl;

        // Fix: React-PDF needs absolute paths or buffers for images. 
        // If it's a local upload, let's try to resolve it to file path or absolute URL.
        if (logoUrl && logoUrl.startsWith('/uploads/')) {
            // Option A: Use public URL (might fail if server cannot resolve itself)
            // logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}${logoUrl}`;

            // Option B: Read file to buffer (robust for local)
            try {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(process.cwd(), 'public', logoUrl);
                if (fs.existsSync(filePath)) {
                    const bitmap = fs.readFileSync(filePath);
                    // react-pdf accepts buffer if we pass it correctly, or data uri
                    const base64 = Buffer.from(bitmap).toString('base64');
                    const ext = path.extname(filePath).toLowerCase();
                    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
                    logoUrl = `data:${mime};base64,${base64}`;
                }
            } catch (e) {
                console.warn('Failed to resolve local logo for PDF', e);
            }
        }

        const invoiceData = {
            id: job.id,
            date: new Date().toLocaleDateString(),
            customerName: job.customerName,
            customerEmail: job.customer?.email || undefined,
            businessName: businessName,
            description: jobDesc,
            amount: amount,
            paymentLink: paymentLink,
            logoUrl: logoUrl || undefined,
            // @ts-ignore
            bankDetails: (job.client.branding?.bankDetails as any) || undefined
        };

        // 1. Render PDF to Buffer
        const stream = await renderToStream(<InvoicePDF invoiceData={invoiceData} />);

        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);

        // STRATEGY: Save to disk and send URL (More reliable than Base64 for large files)
        const fs = require('fs');
        const path = require('path');
        const filename = `invoice-${job.id.slice(0, 8)}-${Date.now()}.pdf`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        // Ensure dir exists (it should, but safety first)
        try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) { }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, pdfBuffer);

        const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/uploads/${filename}`;
        console.log(`[Invoice] Saved PDF to ${filePath}, URL: ${fileUrl}`);

        // 2. Send via Email (Optional, kept for backup)
        let emailSent = false;
        if (invoiceData.customerEmail) {
            try {
                emailSent = await sendEmail({
                    to: invoiceData.customerEmail,
                    subject: `Invoice from ${businessName} - #${job.id.slice(0, 8)}`,
                    html: `
                        <h2>Invoice from ${businessName}</h2>
                        <p>Hello ${job.customerName},</p>
                        <p>Please find attached your invoice for <strong>${jobDesc}</strong>.</p>
                        <p><strong>Amount Due:</strong> NGN ${amount.toLocaleString()}</p>
                        <p><a href="${paymentLink}">Click here to Pay Now</a></p>
                        <p>Thank you!</p>
                    `,
                    attachments: [{
                        filename: `Invoice-${job.id.slice(0, 8)}.pdf`,
                        content: pdfBuffer, // Pass buffer directly
                        contentType: 'application/pdf'
                    }]
                });
            } catch (pdfError) {
                console.error('Email Send Failed:', pdfError);
            }
        }

        const invoiceMessage = `
Hello ${job.customerName},
Here is your invoice from ${businessName}.
*Service:* ${jobDesc}
*Amount Due:* NGN ${amount.toLocaleString()}

📄 *Please open the attached PDF for payment details and account information.*

Thank you for your business!
        `.trim();

        // Strategy Update: Connection to 'localhost' URL fails if Evolution is in Docker.
        // Revert to Base64, but ensure it is robust.
        const fileContent = require('fs').readFileSync(filePath);
        // Try Raw Base64 (some validators fail on data URI prefix for documents)
        const robustBase64 = fileContent.toString('base64');

        console.log(`[Invoice] Generated Base64 size: ${robustBase64.length}`);

        // 3. Send via WhatsApp (Media Message)
        let whatsappSent = false;
        try {
            const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
            const instanceId = job.client.integrations?.whatsappInstanceId;
            const whatsapp = new WhatsAppService(instanceId || undefined);

            // Send via Base64 (No network request needed for file)
            await whatsapp.sendMedia(
                job.customerPhone,
                robustBase64,
                invoiceMessage,
                job.clientId,
                'document'
            );
            whatsappSent = true;
        } catch (wsError: any) {
            console.error('WhatsApp Send Failed (Invoice PDF):', wsError);

            // DEBUG: Write detailed error to file
            try {
                const fs = require('fs');
                const path = require('path');
                fs.writeFileSync(
                    path.join(process.cwd(), 'public', 'debug_invoice_error.txt'),
                    `Error: ${wsError.message}\nStack: ${wsError.stack}\nDetails: ${JSON.stringify(wsError)}`
                );
            } catch (ignored) { }

            // Fallback: Send text only
            try {
                const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
                // Re-instantiate with same instance ID
                const whatsapp = new WhatsAppService(job.client.integrations?.whatsappInstanceId || undefined);
                await whatsapp.sendMessage(job.customerPhone, invoiceMessage, job.clientId);
                whatsappSent = true; // Still counts as sent
            } catch (e) {
                console.error('WhatsApp Fallback Failed:', e);
            }
        }

        // Also save to Message table
        await prisma.message.create({
            data: {
                clientId: job.clientId,
                customerPhone: job.customerPhone,
                customerName: job.customerName,
                messageText: invoiceMessage,
                handledBy: 'BOT',
                status: whatsappSent ? 'COMPLETED' : 'PENDING',
                category: 'INVOICE',
                metadata: { hasPdf: true }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Invoice processed',
            emailSent: emailSent,
            whatsappSent: whatsappSent
        });

    } catch (error) {
        console.error('Invoice Error:', error);
        return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
    }
}
