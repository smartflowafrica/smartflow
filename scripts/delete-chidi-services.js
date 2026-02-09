
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Searching for client 'Chidi Auto'...");

    // Try to find by email first (common pattern)
    // Matching schema: users relation (plural)
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
        return;
    }

    console.log(`✅ Found Client: ${client.businessName} (ID: ${client.id})`);

    // 1. Get all service IDs for this client
    const services = await prisma.service.findMany({
        where: { clientId: client.id },
        select: { id: true }
    });

    const serviceIds = services.map(s => s.id);
    console.log(`Found ${serviceIds.length} services to delete.`);

    if (serviceIds.length > 0) {
        console.log("Deleting associated Appointments first...");
        // 2. Delete Appointments linked to these services
        const deletedAppointments = await prisma.appointment.deleteMany({
            where: { serviceId: { in: serviceIds } }
        });
        console.log(`Deleted ${deletedAppointments.count} appointments linked to these services.`);

        // 3. Delete Services
        console.log("Deleting Services...");
        const result = await prisma.service.deleteMany({
            where: { id: { in: serviceIds } }
        });
        console.log(`🗑️ Successfully deleted ${result.count} services for ${client.businessName}.`);
    } else {
        console.log("No services found to delete.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
