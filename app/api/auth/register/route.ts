import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/services/mail';
import { getWelcomeEmailTemplate } from '@/lib/emails/templates';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Check if client email collision (unlikely but safe to check)
        const existingClient = await prisma.client.findUnique({
            where: { email }
        });

        if (existingClient) {
            return NextResponse.json({ error: 'Email already registered as a business' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create Client + Create User
        // We create a "Pending" client that will be filled in during onboarding
        const result = await prisma.$transaction(async (tx) => {
            const client = await tx.client.create({
                data: {
                    businessName: `${name}'s Business`, // Placeholder
                    businessType: 'OTHER', // Default
                    ownerName: name,
                    phone: '', // Filled in onboarding
                    email: email,
                    monthlyFee: 0,
                    status: 'TRIAL', // Start as Trial
                    planTier: 'BASIC',
                    maxClients: 20
                }
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'CLIENT',
                    staffRole: 'OWNER',
                    clientId: client.id
                }
            });

            // Create default branch? Maybe wait for onboarding.
            // But system expects a branch sometimes. 
            // Let's create a default "Main Branch" to be safe.
            await tx.branch.create({
                data: {
                    name: 'Main Branch',
                    address: 'Main Location',
                    clientId: client.id,
                    isActive: true
                }
            });

            // Create Branding Default
            await tx.branding.create({
                data: {
                    clientId: client.id,
                    primaryColor: '#3B82F6',
                    secondaryColor: '#1F2937'
                }
            });

            // Initialize Bot Config
            await tx.botConfig.create({
                data: {
                    clientId: client.id,
                    greetingMessage: 'Hello! Welcome to our business.',
                    isEnabled: true
                }
            });

            return user;
        });

        // Send Welcome Email (Fire and forget, or await to ensure it sends? Await is safer for critical emails)
        try {
            await sendEmail({
                to: email,
                subject: 'Welcome to SmartFlow Africa! 🚀',
                html: getWelcomeEmailTemplate(name, `${process.env.NEXT_PUBLIC_APP_URL}/login`)
            });
            console.log(`Welcome email sent to ${email}`);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // We don't fail the request if email fails, but we log it.
        }

        return NextResponse.json({
            success: true,
            message: 'User created',
            userId: result.id
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
