
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const clients = await prisma.client.findMany({
        take: 5,
        select: { id: true, businessName: true, businessType: true }
    });
    clients.forEach((c: any) => console.log(`ID: "${c.id}" Length: ${c.id.length}`));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
