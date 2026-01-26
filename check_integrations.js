const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkIntegrations() {
    try {
        const integrations = await prisma.integration.findMany();
        console.log('Integrations found:', integrations.length);
        integrations.forEach(i => {
            console.log(`Client: ${i.clientId}, PaystackKeySet: ${!!i.paystackSecretKey}, KeyLength: ${i.paystackSecretKey?.length}`);
        });

        const users = await prisma.user.findMany({ include: { client: true } });
        console.log('\nUsers/Clients:');
        users.forEach(u => {
            console.log(`User: ${u.email}, ClientId: ${u.client?.id}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkIntegrations();
