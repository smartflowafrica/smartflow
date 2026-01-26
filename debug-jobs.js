const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const client = await prisma.client.findFirst();
        if (!client) {
            console.log('No clients found');
            return;
        }
        console.log('Client:', client.id, client.businessName);

        // Fetch jobs directly using prisma
        const jobs = await prisma.job.findMany({
            where: { clientId: client.id },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        console.log('Jobs found:', jobs.length);
        if (jobs.length > 0) {
            console.log('First Job:', JSON.stringify(jobs[0], null, 2));
        }

        // Test Alerts
        const alerts = await prisma.systemLog.findMany({
            where: { clientId: client.id, level: { in: ['WARNING', 'ERROR', 'CRITICAL'] } },
            take: 5
        });
        console.log('Alerts found:', alerts.length);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
