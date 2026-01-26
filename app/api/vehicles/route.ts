import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { customerId, plateNumber, make, model, year, color, vin } = body;

        if (!customerId || !plateNumber || !make || !model) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get user's client context
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        if (!user?.clientId) {
            return NextResponse.json({ error: 'Client context missing' }, { status: 403 });
        }

        // Verify customer belongs to client
        const customer = await prisma.customer.findFirst({
            where: { id: customerId, clientId: user.clientId }
        });

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Create Vehicle
        const vehicle = await prisma.vehicle.create({
            data: {
                clientId: user.clientId,
                customerId,
                plateNumber,
                make,
                model,
                year: year ? parseInt(year) : undefined,
                color,
                vin
            }
        });

        return NextResponse.json({ success: true, vehicle });

    } catch (error: any) {
        console.error('Create Vehicle Error:', error);
        // Handle unique constraint violation for Plate Number
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A vehicle with this plate number already exists.' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || 'Failed to create vehicle' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');

        // We require filtering by Customer ID for security/scoping in this context usually, 
        // or we could list all client vehicles if needed.
        // Let's enforce customerId filter for now or filter by Client if not provided (All Shop Vehicles)

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user?.clientId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const whereClause: any = { clientId: user.clientId };
        if (customerId) {
            whereClause.customerId = customerId;
        }

        const vehicles = await prisma.vehicle.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, vehicles });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
