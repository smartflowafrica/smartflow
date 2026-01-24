const { PrismaClient } = require('@prisma/client')
// Try to load env from .env file
require('dotenv').config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || "postgresql://postgres.ykjxkxyqrrvphlghzgxl:Murewa95159%23@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        }
    },
})

async function seedMissing() {
    try {
        const email = 'ibiyinka@smartflowafrica.com'
        console.log(`Seeding user: ${email}...`)

        // Check if user exists just in case
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            console.log('User already exists (race condition?), skipping.')
            return
        }

        // 1. Create Client
        console.log('Creating Client...')
        const client = await prisma.client.create({
            data: {
                ownerName: 'Ibiyinka Admin',
                email: email, // Client email
                businessName: 'SmartFlow Africa Test',
                phone: '08000000000', // Required
                businessType: 'OTHER', // Required Enum
                monthlyFee: 0 // Required
            }
        })
        console.log('Client created:', client.id)

        // 2. Create User linked to Client
        console.log('Creating User...')
        const user = await prisma.user.create({
            data: {
                email: email,
                name: 'Ibiyinka',
                role: 'ADMIN',
                clientId: client.id
            }
        })

        console.log('✅ User created successfully:', user)

    } catch (error) {
        console.error('Error seeding:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedMissing()
