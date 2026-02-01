
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Client Integrations...');
    const clients = await prisma.client.findMany({
        include: {
            integrations: true
        }
    });

    if (clients.length === 0) {
        console.log('No clients found.');
    }

    for (const client of clients) {
        console.log(`\nClient: ${client.businessName} (ID: ${client.id})`);
        console.log(`Owner: ${client.phone}`);
        if (client.integrations) {
            console.log(`Integration WhatsApp Number: ${client.integrations.whatsappNumber}`);
            console.log(`Integration Instance ID: ${client.integrations.whatsappInstanceId}`);
        } else {
            console.log('No Integration Record found.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
