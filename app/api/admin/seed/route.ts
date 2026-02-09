import { NextResponse } from 'next/server';
import { PrismaClient, BusinessType, PlanTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma
const prisma = new PrismaClient();


export async function GET(req: Request) {
    try {
        // SECURITY: Prevent accidental seeding in production
        const authHeader = req.headers.get('x-admin-secret');
        if (process.env.NODE_ENV === 'production' && authHeader !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        console.log('🌱 Starting Seed Process...');
        const results = [];

        // 1. Create Admin User (Auth + DB)
        const adminEmail = 'admin@smartflowafrica.com';
        const adminPassword = 'admin123'; // In a real app, force change on first login

        // Create in Prisma DB (Admin)
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminDb = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                email: adminEmail,
                name: 'Super Admin',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        results.push(`Admin DB: ${adminDb.id}`);




        // 2. Client: Chidi Auto Repairs
        const chidiEmail = 'chidi@example.com';
        const chidiPassword = await bcrypt.hash('password123', 10);

        const chidiAuto = await prisma.client.upsert({
            where: { email: chidiEmail },
            update: {
                // Determine if we should update other fields, for now just ensure access
                // users relation update is separate
            },
            create: {
                businessName: 'Chidi Auto Repairs',
                businessType: BusinessType.AUTO_MECHANIC,
                ownerName: 'Chidi Okafor',
                phone: '08012345678',
                email: chidiEmail,
                address: '45 Adeola Odeku Street, Victoria Island, Lagos',
                hours: {
                    monday: '8am-6pm', tuesday: '8am-6pm', wednesday: '8am-6pm',
                    thursday: '8am-6pm', friday: '8am-6pm', saturday: '9am-4pm', sunday: 'Closed'
                },
                planTier: PlanTier.PROFESSIONAL,
                monthlyFee: 60000,
                branding: {
                    create: {
                        primaryColor: '#EF4444', // Red
                        secondaryColor: '#1F2937',
                        font: 'Inter',
                        tagline: 'We fix cars right!',
                    }
                }
            }
        });

        // Upsert Chidi User explicitly to ensure password update
        await prisma.user.upsert({
            where: { email: chidiEmail },
            update: {
                password: chidiPassword,
                role: 'CLIENT',
                clientId: chidiAuto.id
            },
            create: {
                email: chidiEmail,
                name: 'Chidi Okafor',
                password: chidiPassword,
                role: 'CLIENT',
                clientId: chidiAuto.id
            }
        });
        results.push(`Client: Chidi Auto Created`);

        // Services for Chidi
        const chidiServices = [
            { name: 'Oil Change', price: 15000, duration: 60 },
            { name: 'Brake Service', price: 35000, duration: 120 },
        ];
        for (const s of chidiServices) {
            await prisma.service.create({
                data: { ...s, clientId: chidiAuto.id }
            });
        }

        // 3. Client: Mama's Kitchen
        const mamaEmail = 'mama@example.com';
        const mamaPassword = await bcrypt.hash('password123', 10);

        const mamaKitchen = await prisma.client.upsert({
            where: { email: mamaEmail },
            update: {},
            create: {
                businessName: "Mama's Kitchen",
                businessType: BusinessType.RESTAURANT,
                ownerName: 'Ngozi Adeyemi',
                phone: '08087654321',
                email: mamaEmail,
                address: '12 Herbert Macaulay, Yaba',
                planTier: PlanTier.BASIC,
                monthlyFee: 30000,
                branding: {
                    create: {
                        primaryColor: '#F59E0B', // Orange/Amber
                        secondaryColor: '#78350F',
                        font: 'Poppins',
                        tagline: 'Taste like home',
                    }
                }
            }
        });

        // Upsert Mama User explicitly
        await prisma.user.upsert({
            where: { email: mamaEmail },
            update: {
                password: mamaPassword,
                role: 'CLIENT',
                clientId: mamaKitchen.id,
            },
            create: {
                email: mamaEmail,
                name: 'Ngozi Adeyemi',
                password: mamaPassword,
                role: 'CLIENT',
                clientId: mamaKitchen.id
            }
        });

        results.push(`Client: Mama's Kitchen Created`);

        // Services for Mama
        const mamaServices = [
            { name: 'Jollof Rice', price: 2500, duration: 30 },
            { name: 'Fried Rice', price: 2500, duration: 30 },
        ];
        for (const s of mamaServices) {
            await prisma.service.create({
                data: { ...s, clientId: mamaKitchen.id }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Seed completed successfully",
            logs: results
        });

    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}
