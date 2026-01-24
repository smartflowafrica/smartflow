// Seeding script for demo users
// Run with: npx ts-node prisma/seed-users.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding demo users...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('password123', 10);

    // Create or update Admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@smartflowafrica.com' },
        update: { password: adminPassword },
        create: {
            email: 'admin@smartflowafrica.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN'
        }
    });
    console.log('Admin user created/updated:', adminUser.email);

    // Create demo client first
    const demoClient = await prisma.client.upsert({
        where: { email: 'chidi@example.com' },
        update: {},
        create: {
            businessName: 'Chidi\'s Auto Shop',
            businessType: 'AUTO_MECHANIC',
            ownerName: 'Chidi Okafor',
            phone: '+234 800 123 4567',
            email: 'chidi@example.com',
            address: '123 Lagos Street, Ikeja',
            planTier: 'BASIC',
            monthlyFee: 5000,
            status: 'ACTIVE'
        }
    });
    console.log('Demo client created/updated:', demoClient.businessName);

    // Create or update Client user
    const clientUser = await prisma.user.upsert({
        where: { email: 'chidi@example.com' },
        update: {
            password: clientPassword,
            clientId: demoClient.id
        },
        create: {
            email: 'chidi@example.com',
            password: clientPassword,
            name: 'Chidi Okafor',
            role: 'CLIENT',
            clientId: demoClient.id
        }
    });
    console.log('Client user created/updated:', clientUser.email);

    console.log('\n✅ Demo users seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('  Admin: admin@smartflowafrica.com / admin123');
    console.log('  Client: chidi@example.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
