import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { initializePaystackPayment } from '@/lib/paystack';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true },
        });

        if (!dbUser?.client) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
        }

        const client = dbUser.client;
        const amountInKobo = client.monthlyFee * 100;

        const paymentData = await initializePaystackPayment({
            email: client.email,
            amount: amountInKobo,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/settings?tab=billing&payment=success`,
            metadata: {
                clientId: client.id,
                type: 'SUBSCRIPTION_PAYMENT',
                planTier: client.planTier
            }
        });

        await prisma.subscriptionPayment.create({
            data: {
                clientId: client.id,
                amount: amountInKobo,
                reference: paymentData.data.reference,
                status: 'pending',
                currency: 'NGN'
            }
        });

        return NextResponse.json({
            authorizationUrl: paymentData.data.authorization_url,
            reference: paymentData.data.reference
        });

    } catch (error: any) {
        console.error('Subscription Init Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
