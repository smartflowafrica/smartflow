import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userRole = (session.user as any).staffRole;
        if (userRole !== 'OWNER' && userRole !== 'MANAGER') {
            return NextResponse.json({ error: 'Permission denied. Manager or Owner access required.' }, { status: 403 });
        }

        const body = await request.json();
        const { name, sku, price, cost, quantity, lowStockThreshold, category } = body;

        // Verify ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
            select: { clientId: true }
        });

        if (!existingProduct || existingProduct.clientId !== (session.user as any).clientId) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name,
                sku,
                price: price ? parseFloat(price) : undefined,
                cost: cost ? parseFloat(cost) : undefined,
                quantity: quantity ? parseInt(quantity) : undefined,
                lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
                category
            }
        });

        return NextResponse.json({ success: true, product });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userRole = (session.user as any).staffRole;
        if (userRole !== 'OWNER' && userRole !== 'MANAGER') {
            return NextResponse.json({ error: 'Permission denied. Manager or Owner access required.' }, { status: 403 });
        }

        // Verify ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
            select: { clientId: true }
        });

        if (!existingProduct || existingProduct.clientId !== (session.user as any).clientId) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        // Soft delete
        await prisma.product.update({
            where: { id: params.id },
            data: { isActive: false }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
