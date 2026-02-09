
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/services/invoice-generator';

// Public Route - No Authentication Required (Secured by UUID)
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = params.id;

        // Fetch just enough to verify existence (full fetch happens in generator)
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { id: true }
        });

        if (!job) {
            return new NextResponse('Invoice not found', { status: 404 });
        }

        // Generate PDF
        const { base64, filename } = await generateInvoicePDF(jobId, 'invoice');

        // Convert base64 to Buffer
        const pdfBuffer = Buffer.from(base64, 'base64');

        // Return as file stream
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`
            }
        });

    } catch (error: any) {
        console.error('[Public Invoice Access] Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
