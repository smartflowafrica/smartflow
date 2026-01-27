import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInspectionPDF } from '@/lib/services/inspection-generator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const jobId = params.id;

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { inspectionData: true }
        });

        if (!job || !job.inspectionData) {
            return new NextResponse('Inspection not found', { status: 404 });
        }

        // Generate PDF
        const { base64, filename } = await generateInspectionPDF(jobId, job.inspectionData);

        // Convert base64 to Buffer
        const pdfBuffer = Buffer.from(base64, 'base64');

        // Return as file stream
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`
            }
        });

    } catch (error) {
        console.error('Download PDF Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
