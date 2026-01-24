const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    },
    log: ['query', 'info', 'warn', 'error'],
})

async function test() {
    try {
        console.log('Testing database connection...')
        console.log('Using URL:', process.env.DIRECT_URL || process.env.DATABASE_URL)

        const result = await prisma.$queryRaw`SELECT 1 as test`
        console.log('✅ Database connection successful!')
        console.log('Result:', result)

        // Try to count clients
        const clientCount = await prisma.client.count()
        console.log(`Found ${clientCount} clients`)

    } catch (error) {
        console.error('❌ Database connection failed:')
        console.error(error)
    } finally {
        await prisma.$disconnect()
    }
}

test()
