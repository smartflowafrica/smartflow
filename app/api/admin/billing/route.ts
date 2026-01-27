import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';

        // Fetch payments with filters
        const payments = await prisma.subscriptionPayment.findMany({
            where: {
                OR: search ? [
                    { reference: { contains: search, mode: 'insensitive' } },
                    { client: { businessName: { contains: search, mode: 'insensitive' } } }
                ] : undefined
            },
            orderBy: { createdAt: 'desc' },
            include: {
                client: {
                    select: {
                        id: true,
                        businessName: true,
                        email: true
                    }
                }
            },
            take: 100 // Limit for now
        });

        return NextResponse.json(payments);

    } catch (error) {
        console.error('Billing API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
