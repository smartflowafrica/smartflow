const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Check users
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, clientId: true }
    });
    console.log('Users:', JSON.stringify(users, null, 2));

    // Check clients
    const clients = await prisma.client.findMany({
        select: { id: true, businessName: true, email: true }
    });
    console.log('\nClients:', JSON.stringify(clients, null, 2));

    // Check jobs
    const jobs = await prisma.job.findMany({
        select: { id: true, customerName: true, status: true, clientId: true }
    });
    console.log('\nJobs:', JSON.stringify(jobs, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
