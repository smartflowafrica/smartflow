
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function clearCustomers() {
    try {
        console.log('Starting Cleanup...');

        // 1. Delete Messages (Referencing customerPhone)
        console.log('Deleting Messages...');
        const deletedMessages = await prisma.message.deleteMany({});
        console.log(`Deleted ${deletedMessages.count} messages.`);

        // 2. Delete Conversations
        console.log('Deleting Conversations...');
        const deletedConversations = await prisma.conversation.deleteMany({});
        console.log(`Deleted ${deletedConversations.count} conversations.`);

        // 3. Delete Vehicles (Linked to Customer)
        console.log('Deleting Vehicles...');
        const deletedVehicles = await prisma.vehicle.deleteMany({});
        console.log(`Deleted ${deletedVehicles.count} vehicles.`);

        // 4. Delete Jobs (Linked to Customer)
        console.log('Deleting Jobs...');
        const deletedJobs = await prisma.job.deleteMany({});
        console.log(`Deleted ${deletedJobs.count} jobs.`);

        // 5. Delete Appointments (Linked to Customer)
        console.log('Deleting Appointments...');
        const deletedAppointments = await prisma.appointment.deleteMany({});
        console.log(`Deleted ${deletedAppointments.count} appointments.`);

        // 6. Delete Customers
        console.log('Deleting Customers...');
        const deletedCustomers = await prisma.customer.deleteMany({});
        console.log(`Deleted ${deletedCustomers.count} customers.`);

        console.log('✅ Cleanup Complete. All customer data reset.');

    } catch (error) {
        console.error('Cleanup Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearCustomers();
