const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.client.count()
    console.log(`Total clients: ${count}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
