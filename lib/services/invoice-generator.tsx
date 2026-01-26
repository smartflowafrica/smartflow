import { renderToStream } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

type DocType = 'invoice' | 'receipt';

export async function generateInvoicePDF(jobId: string, type: DocType = 'invoice') {
    // Fetch Job Data
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            client: { include: { branding: true } },
            customer: true
        }
    });

    if (!job) throw new Error('Job not found');

    const isReceipt = type === 'receipt';

    // Prepare Data
    const amount = job.finalAmount || job.price || 0;
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/payment/pay/${job.id}`;
    let logoUrl = job.client.branding?.logoUrl;

    // Resolve Logo (Local file to Base64)
    if (logoUrl && logoUrl.startsWith('/uploads/')) {
        try {
            const filePath = path.join(process.cwd(), 'public', logoUrl);
            if (fs.existsSync(filePath)) {
                const bitmap = fs.readFileSync(filePath);
                const base64 = Buffer.from(bitmap).toString('base64');
                const ext = path.extname(filePath).toLowerCase();
                const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
                logoUrl = `data:${mime};base64,${base64}`;
            }
        } catch (e) {
            console.warn('Failed to resolve local logo for PDF', e);
        }
    }

    const docData = {
        id: job.id,
        date: new Date().toLocaleDateString(),
        customerName: job.customerName,
        customerEmail: job.customer?.email || undefined,
        businessName: job.client.businessName,
        description: job.description,
        amount: amount,
        paymentLink: isReceipt ? 'PAID' : paymentLink,
        logoUrl: logoUrl || undefined,
        // @ts-ignore
        bankDetails: job.client.branding?.bankDetails || undefined,
        isReceipt: isReceipt,
        status: isReceipt ? 'PAID' : (job.paymentStatus || 'PENDING')
    };

    // Render PDF
    const stream = await renderToStream(<InvoicePDF invoiceData={docData} />);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Save to temp file logic can be here if needed for URL, 
    // but we primarily need Base64 for WhatsApp
    const base64 = pdfBuffer.toString('base64');

    return {
        base64,
        filename: `${type}-${job.id.slice(0, 8)}.pdf`,
        job
    };
}
