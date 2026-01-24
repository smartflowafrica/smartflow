const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed() {
    try {
        console.log('🌱 Seeding database...')

        // Create a test client (Auto Mechanic Shop)
        const client = await prisma.client.upsert({
            where: { email: 'mechanic@test.com' },
            update: {},
            create: {
                id: 'test-mechanic-1',
                businessName: 'Quick Fix Auto Repair',
                businessType: 'AUTO_MECHANIC',
                ownerName: 'John Mechanic',
                phone: '08012345678',
                email: 'mechanic@test.com',
                address: '123 Lagos Street, Ikeja, Lagos',
                planTier: 'PROFESSIONAL',
                monthlyFee: 75000,
                status: 'ACTIVE',
            },
        })
        console.log('✅ Created client:', client.businessName)

        // Create branding for the client
        const branding = await prisma.branding.upsert({
            where: { clientId: client.id },
            update: {},
            create: {
                clientId: client.id,
                primaryColor: '#EF4444',
                secondaryColor: '#1F2937',
                font: 'Inter',
                tagline: 'Your Trusted Auto Repair Partner',
            },
        })
        console.log('✅ Created branding')

        // Create a user for this client
        const user = await prisma.user.upsert({
            where: { email: 'mechanic@test.com' },
            update: {},
            create: {
                email: 'mechanic@test.com',
                name: 'John Mechanic',
                role: 'CLIENT',
                clientId: client.id,
            },
        })
        console.log('✅ Created user:', user.email)

        // Create some services
        const services = await Promise.all([
            prisma.service.create({
                data: {
                    clientId: client.id,
                    name: 'Oil Change',
                    price: 5000, // Fixed price
                    duration: 30, // mins
                    category: 'Maintenance',
                    isActive: true,
                },
            }),
            prisma.service.create({
                data: {
                    clientId: client.id,
                    name: 'Brake Service',
                    price: 15000,
                    duration: 120, // 2 hours
                    category: 'Repair',
                    isActive: true,
                },
            }),
            prisma.service.create({
                data: {
                    clientId: client.id,
                    name: 'Engine Diagnostics',
                    price: 10000,
                    duration: 60, // 1 hour
                    category: 'Diagnostics',
                    isActive: true,
                },
            }),
        ])
        console.log(`✅ Created ${services.length} services`)

        // Create some customers
        const customer1 = await prisma.customer.create({
            data: {
                clientId: client.id,
                phone: '08087654321',
                name: 'Jane Smith',
                email: 'jane@example.com',
                totalVisits: 3,
                totalSpent: 45000,
                metadata: {
                    vehicle: 'Toyota Camry 2018',
                    plateNumber: 'ABC-123-XY',
                },
            },
        })

        const customer2 = await prisma.customer.create({
            data: {
                clientId: client.id,
                phone: '08098765432',
                name: 'David Johnson',
                totalVisits: 1,
                totalSpent: 15000,
                metadata: {
                    vehicle: 'Honda Accord 2020',
                    plateNumber: 'XYZ-789-AB',
                },
            },
        })
        console.log('✅ Created 2 customers')

        // Create some jobs
        const jobs = await Promise.all([
            prisma.job.create({
                data: {
                    clientId: client.id,
                    customerId: customer1.id,
                    customerPhone: customer1.phone,
                    customerName: customer1.name,
                    description: 'Toyota Camry - Brake pad replacement',
                    status: 'in_progress',
                    price: 25000,
                    notes: 'Customer mentioned squeaking noise when braking',
                },
            }),
            prisma.job.create({
                data: {
                    clientId: client.id,
                    customerId: customer1.id,
                    customerPhone: customer1.phone,
                    customerName: customer1.name,
                    description: 'Toyota Camry - Oil change and filter',
                    status: 'ready',
                    price: 8000,
                    notes: 'Used synthetic oil as requested',
                },
            }),
            prisma.job.create({
                data: {
                    clientId: client.id,
                    customerId: customer2.id,
                    customerPhone: customer2.phone,
                    customerName: customer2.name,
                    description: 'Honda Accord - Engine diagnostics',
                    status: 'diagnosing',
                    price: 15000,
                    notes: 'Check engine light is on',
                },
            }),
            prisma.job.create({
                data: {
                    clientId: client.id,
                    customerPhone: '08076543210',
                    customerName: 'Michael Brown',
                    description: 'Mercedes Benz - AC repair',
                    status: 'received',
                    price: 45000,
                    notes: 'AC not cooling properly',
                },
            }),
        ])
        console.log(`✅ Created ${jobs.length} jobs`)

        // Create some messages
        const messages = await Promise.all([
            prisma.message.create({
                data: {
                    clientId: client.id,
                    customerPhone: customer1.phone,
                    customerName: customer1.name,
                    messageText: 'Hello, is my car ready?',
                    botResponse: 'Let me check the status for you...',
                    category: 'status_check',
                    handledBy: 'BOT',
                    status: 'COMPLETED',
                },
            }),
            prisma.message.create({
                data: {
                    clientId: client.id,
                    customerPhone: customer2.phone,
                    customerName: customer2.name,
                    messageText: 'I need to book an appointment for next week',
                    botResponse: 'Sure! What day works best for you?',
                    category: 'booking',
                    handledBy: 'BOT',
                    status: 'COMPLETED',
                },
            }),
        ])
        console.log(`✅ Created ${messages.length} messages`)

        console.log('\n🎉 Database seeded successfully!')
        console.log('\n📝 Test Credentials:')
        console.log('Email: mechanic@test.com')
        console.log('Role: CLIENT')
        console.log('Business: Quick Fix Auto Repair (AUTO_MECHANIC)')
        console.log('\n💡 Note: You need to create this user in Supabase Auth with password: password')

    } catch (error) {
        console.error('❌ Error seeding database:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

seed()
