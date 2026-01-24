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
            include: { client: true, customer: true }
        });

        if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

        const amount = job.finalAmount || job.price || 0;
        const businessName = job.client.businessName;
        const jobDesc = job.description;
        const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/payment/pay/${job.id}`;

        const invoiceData = {
            id: job.id,
            date: new Date().toLocaleDateString(),
            customerName: job.customerName,
            customerEmail: job.customer?.email || undefined,
            businessName: businessName,
            description: jobDesc,
            amount: amount,
            paymentLink: paymentLink
        };

        let emailSent = false;
        if (invoiceData.customerEmail) {
            try {
                const stream = await renderToStream(<InvoicePDF invoiceData={invoiceData} />);

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
                        content: stream as any,
                        contentType: 'application/pdf'
                    }]
                });
            } catch (pdfError) {
                console.error('PDF Generation/Email Failed:', pdfError);
            }
        }

        const invoiceMessage = `
Hello ${job.customerName},
Here is your invoice from ${businessName}.

*Service:* ${jobDesc}
*Amount Due:* NGN ${amount.toLocaleString()}

Please click the link below to pay securely:
${paymentLink} 

Thank you for your business!
        `.trim();

        // Send invoice via WhatsApp
        let whatsappSent = false;
        try {
            const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
            const whatsapp = new WhatsAppService();
            await whatsapp.sendMessage(job.customerPhone, invoiceMessage, job.clientId);
            whatsappSent = true;
        } catch (wsError) {
            console.error('WhatsApp Send Failed (Invoice):', wsError);
        }

        // Also save to Message table for records
        await prisma.message.create({
            data: {
                clientId: job.clientId,
                customerPhone: job.customerPhone,
                customerName: job.customerName,
                messageText: invoiceMessage,
                handledBy: 'BOT',
                status: whatsappSent ? 'COMPLETED' : 'PENDING',
                category: 'INVOICE'
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
