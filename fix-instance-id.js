const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// The ACTUAL Instance ID from your logs/webhook success
const NEW_INSTANCE_ID = 'ce19b768-d033-4175-95a4-f38d2a4234d8';
const CLIENT_ID = 'cmjljfn5a00028oay4dfj4o4e'; // Chidi Auto Mechanic

async function fix() {
    try {
        console.log(`Updating Client ${CLIENT_ID}...`);
        console.log(`Setting WhatsApp Instance ID to: ${NEW_INSTANCE_ID}`);

        const result = await prisma.integration.updateMany({
            where: {
                clientId: CLIENT_ID
            },
            data: {
                whatsappInstanceId: NEW_INSTANCE_ID
            }
        });

        console.log('✅ Update Result:', result);
        console.log('\n🎉 Should work now! Send "Test" again.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
