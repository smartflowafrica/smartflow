import { renderToStream } from '@react-pdf/renderer';
import InspectionPDF from '@/components/pdf/InspectionPDF';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function generateInspectionPDF(jobId: string, inspectionData: any) {
    // Fetch Job & Client Data
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            client: { include: { branding: true } },
            customer: true,
            vehicle: true
        }
    });

    if (!job) throw new Error('Job not found');

    let logoUrl = job.client.branding?.logoUrl;

    // Resolve Logo
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

    const vehicleStr = job.vehicle
        ? `${job.vehicle.make} ${job.vehicle.model} ${job.vehicle.year || ''} - ${job.vehicle.plateNumber}`
        : 'Vehicle details not recorded';

    const pdfData = {
        id: job.id,
        date: new Date().toLocaleDateString(),
        businessName: job.client.businessName,
        customerName: job.customerName,
        vehicle: vehicleStr,
        logoUrl: logoUrl || undefined,
        items: inspectionData.items,
        mechanicNotes: inspectionData.notes
    };

    // Render
    const stream = await renderToStream(<InspectionPDF data={pdfData} />);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);
    const base64 = pdfBuffer.toString('base64');

    return {
        base64,
        filename: `Inspection-${job.id.slice(0, 8)}.pdf`
    };
}
