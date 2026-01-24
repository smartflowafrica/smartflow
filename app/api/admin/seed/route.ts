import { NextResponse } from 'next/server';
import { PrismaClient, BusinessType, PlanTier } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Forces the use of the working connection string
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.ykjxkxyqrrvphlghzgxl:Murewa95159%23@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        }
    }
});

// Create Supabase Admin client for Auth management
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET() {
    try {
        console.log('🌱 Starting Seed Process...');
        const results = [];

        // 1. Create Admin User (Auth + DB)
        const adminEmail = 'admin@smartflowafrica.com';
        const adminPassword = 'admin123'; // In a real app, force change on first login

        // Create in Supabase Auth
        const { data: adminAuth, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
            user_metadata: { name: 'Super Admin', role: 'ADMIN' }
        });

        if (adminAuthError) {
            // Ignore if already exists
            results.push(`Admin Auth: ${adminAuthError.message}`);
        } else {
            results.push(`Admin Auth: Created (${adminAuth.user.id})`);
        }

        // Create in Prisma DB
        const adminDb = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                name: 'Super Admin',
                role: 'ADMIN',
            },
        });
        results.push(`Admin DB: ${adminDb.id}`);


        // 2. Client: Chidi Auto Repairs
        const chidiEmail = 'chidi@example.com';
        const { data: chidiAuth, error: chidiAuthError } = await supabaseAdmin.auth.admin.createUser({
            email: chidiEmail,
            password: 'password123',
            email_confirm: true,
            user_metadata: { name: 'Chidi Okafor', role: 'CLIENT' }
        });
        if (chidiAuthError) results.push(`Chidi Auth: ${chidiAuthError.message}`);
        else results.push(`Chidi Auth: Created`);

        const chidiAuto = await prisma.client.upsert({
            where: { email: chidiEmail },
            update: {},
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
                },
                user: {
                    create: {
                        email: chidiEmail,
                        name: 'Chidi Okafor',
                        role: 'CLIENT'
                    }
                }
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
        const { data: mamaAuth, error: mamaAuthError } = await supabaseAdmin.auth.admin.createUser({
            email: mamaEmail,
            password: 'password123',
            email_confirm: true,
            user_metadata: { name: 'Ngozi Adeyemi', role: 'CLIENT' }
        });
        if (mamaAuthError) results.push(`Mama Auth: ${mamaAuthError.message}`);
        else results.push(`Mama Auth: Created`);

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
                },
                user: {
                    create: {
                        email: mamaEmail,
                        name: 'Ngozi Adeyemi',
                        role: 'CLIENT'
                    }
                }
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
