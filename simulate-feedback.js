const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const client = await prisma.client.findFirst();
        if (!client) {
            console.log('No client found');
            return;
        }

        // 1. Add 5-star rating to the most recent job
        const lastJob = await prisma.job.findFirst({
            where: { clientId: client.id, status: { not: 'archived' } },
            orderBy: { createdAt: 'desc' }
        });

        if (lastJob) {
            await prisma.job.update({
                where: { id: lastJob.id },
                data: {
                    feedbackRating: 5,
                    feedbackNotes: "Great service! Verified by simulation."
                }
            });
            console.log(`✅ Updated Job ${lastJob.id} with 5 stars.`);
        } else {
            console.log('No jobs found to rate.');
        }

        // 2. Create a Fake Negative Alert
        await prisma.systemLog.create({
            data: {
                clientId: client.id,
                level: 'WARNING',
                message: "⚠️ Negative Feedback (1/5) received from Simulation User. 'Tyres still shaky'.",
                metadata: { source: 'simulation' }
            }
        });
        console.log(`✅ Created simulation alert.`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
