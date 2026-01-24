const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkServices() {
    console.log('--- Checking All Available Services for Client ---');
    // Using the client ID found in logs: cmkn6i90n0001fzmgndatlc5e
    const clientId = 'cmkn6i90n0001fzmgndatlc5e';

    const services = await prisma.service.findMany({
        where: { clientId },
        select: { id: true, name: true, isActive: true }
    });

    console.log(JSON.stringify(services, null, 2));
    await prisma.$disconnect();
}

checkServices();
