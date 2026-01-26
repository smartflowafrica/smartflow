import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { name, sku, price, cost, quantity, lowStockThreshold, category } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user?.clientId) return NextResponse.json({ error: 'Client context missing' }, { status: 403 });

        const product = await prisma.product.create({
            data: {
                clientId: user.clientId,
                name,
                sku,
                price: parseFloat(price),
                cost: parseFloat(cost || 0),
                quantity: parseInt(quantity || 0),
                lowStockThreshold: parseInt(lowStockThreshold || 5),
                category
            }
        });

        return NextResponse.json({ success: true, product });

    } catch (error: any) {
        console.error('Create Product Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user?.clientId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const products = await prisma.product.findMany({
            where: { clientId: user.clientId, isActive: true },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ success: true, products });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
