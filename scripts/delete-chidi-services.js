
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Searching for client 'Chidi Auto'...");

    // Try to find by email first (common pattern)
    // FIXED: user -> users (Plural relation in schema)
    let client = await prisma.client.findFirst({
        where: {
            users: { some: { email: { contains: 'chidi', mode: 'insensitive' } } }
        }
    });

    // If not found, try robust name search
    if (!client) {
        client = await prisma.client.findFirst({
            where: {
                AND: [
                    { businessName: { contains: 'Chidi', mode: 'insensitive' } },
                    { businessName: { contains: 'Auto', mode: 'insensitive' } }
                ]
            }
        });
    }

    if (!client) {
        console.log('❌ Client not found. Please check the name or email.');
        // List potential candidates?
        const candidates = await prisma.client.findMany({
            take: 5,
            where: { businessName: { contains: 'Auto', mode: 'insensitive' } }
        });
        if (candidates.length > 0) {
            console.log("Did you mean one of these?");
            candidates.forEach(c => console.log(` - ${c.businessName} (${c.id})`));
        }
        return;
    }

    console.log(`✅ Found Client: ${client.businessName} (ID: ${client.id})`);

    // Delete all services
    const result = await prisma.service.deleteMany({
        where: { clientId: client.id }
    });

    console.log(`🗑️ Successfully deleted ${result.count} services for ${client.businessName}.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
