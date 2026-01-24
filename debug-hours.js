const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHours() {
    const clientId = 'cmkn6i90n0001fzmgndatlc5e'; // The client we've been testing with
    const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: { businessName: true, hours: true }
    });
    console.log(JSON.stringify(client, null, 2));

    await prisma.$disconnect();
}

checkHours();
