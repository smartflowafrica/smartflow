const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || "postgresql://postgres.ykjxkxyqrrvphlghzgxl:Murewa95159%23@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        }
    },
})

async function checkUsers() {
    try {
        console.log('Checking Users in DB...')
        const users = await prisma.user.findMany()
        console.log(`Found ${users.length} users:`)
        users.forEach(u => console.log(`- ${u.email} (ID: ${u.id}, ClientID: ${u.clientId})`))

        const targetEmail = 'ibiyinka@smartflowafrica.com' // From logs
        const match = users.find(u => u.email === targetEmail)

        if (!match) {
            console.log(`\n❌ Target user ${targetEmail} NOT found!`)
        } else {
            console.log(`\n✅ Target user found:`, match)
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUsers()
