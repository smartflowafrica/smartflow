
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CLIENT_ID = 'cmkn6i90n00003gu4pc41u1w1m';

async function main() {
    // Dynamic Fetch
    const client = await prisma.client.findFirst();
    if (!client) {
        console.error('NO CLIENTS FOUND IN DB');
        process.exit(1);
    }
    const CLIENT_ID = client.id;
    console.log('Starting onboarding simulation for client:', CLIENT_ID);

    // Mock Payload
    const services = [
        { name: 'Test Service 1', description: 'Desc 1', price: 5000, category: 'General' },
        { name: 'Test Service 2', description: 'Desc 2', price: 10000, category: 'Premium' }
    ];

    const info = {
        name: 'Test Business',
        phone: '08012345678',
        owner: 'Test Owner',
        type: 'cl5...' // Simulate a Sector ID or dummy. 
        // Wait, route.ts uses sectorId to find BusinessSector.
        // If we don't provide a valid Sector ID, businessType might default to 'OTHER'.
    };

    // We'll skip sectorId lookup for now to see if base update works, 
    // or we can fetch a sector first.
    const sector = await prisma.businessSector.findFirst();
    if (sector) {
        console.log('Found mock sector:', sector.name, sector.id);
        info.type = sector.id;
    }

    // Verify first
    const check = await prisma.client.findUnique({ where: { id: CLIENT_ID } });
    if (!check) {
        console.error(`CLIENT [${CLIENT_ID}] NOT FOUND in DB!`);
        process.exit(1);
    }
    console.log(`CLIENT FOUND: ${check.businessName} (Type: ${check.businessType})`);

    try {
        await prisma.$transaction(async (tx: any) => {
            console.log('Updating Client...');
            await tx.client.update({
                where: { id: CLIENT_ID },
                data: {
                    businessName: info.name,
                    // businessType is derived in the route, but here we must replicate logic.
                    // route checks sector code.
                    businessType: 'RESTAURANT', // Hardcoded valid enum for test
                    sectorId: info.type || undefined,
                    ownerName: info.owner,
                    phone: info.phone,
                    metadata: {
                        onboardingComplete: true,
                        simulation: true
                    }
                }
            });

            console.log('Creating Services...');
            if (services.length > 0) {
                await tx.service.createMany({
                    data: services.map((s: any) => ({
                        clientId: CLIENT_ID,
                        name: s.name,
                        description: s.description,
                        price: s.price, // Route uses parseFloat
                        category: s.category,
                        duration: 30,
                        isActive: true
                    }))
                });
            }
            // route.ts logic: price: parseFloat(s.price)
            // schema: price Decimal?
            // If we send number, Prisma handles it for Decimal? Yes.
        });
        console.log('Onboarding Simulation SUCCESS!');
    } catch (error) {
        console.error('Onboarding Simulation FAILED:', error);
        process.exit(1);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
