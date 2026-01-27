const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const client = await prisma.client.findFirst();
        // Find the job with ID ending in R8Z9 (from user log)
        const job = await prisma.job.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });

        console.log('Most Recent Job:', {
            id: job.id,
            status: job.status,
            paymentStatus: job.paymentStatus,
            feedbackRequestSent: job.feedbackRequestSent,
            feedbackRating: job.feedbackRating,
            customerPhone: job.customerPhone
        });

        // Find the one the user specifically mentioned if different
        // Job ID: CMKVR8Z9 -> likely the ID string
        // If the user provided ID is short, it might be the slice usually shown in text.
        // Let's rely on most recent for now.

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
