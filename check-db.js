const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log('--- Checking Client Instance Mappings ---');

        const clients = await prisma.client.findMany({
            select: {
                id: true,
                businessName: true,
                integrations: true
            }
        });

        console.log(`Found ${clients.length} Clients.`);

        clients.forEach(c => {
            console.log(`\nClient: ${c.businessName} (${c.id})`);
            if (c.integrations) {
                console.log(`   - WhatsApp Instance ID: ${c.integrations.whatsappInstanceId || 'NULL'}`);
                console.log(`   - WhatsApp Number:      ${c.integrations.whatsappNumber || 'NULL'}`);
            } else {
                console.log('   - No Integrations Configured');
            }
        });

        console.log('\n--- End Check ---');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
