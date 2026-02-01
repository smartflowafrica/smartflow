
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.businessSector.count();
    console.log('BusinessSector Count:', count);
    const sectors = await prisma.businessSector.findMany();
    console.log('Sectors:', JSON.stringify(sectors, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
