import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const service = await prisma.service.findUnique({
            where: { id: params.id },
            include: { client: true }
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        // Ensure user belongs to the same client
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { clientId: true }
        });

        if (service.clientId !== dbUser?.clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { clientId: true }
        });

        if (!dbUser?.clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Verify ownership
        const existingService = await prisma.service.findUnique({
            where: { id: params.id },
            select: { clientId: true }
        });

        if (!existingService || existingService.clientId !== dbUser.clientId) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        // Destructure allowed fields to prevent unsafe updates (e.g. clientId, id)
        const {
            name, description, price, duration, category,
            metadata, isActive, commitmentFee, pricingRules
        } = body;

        const updatedService = await prisma.service.update({
            where: { id: params.id },
            data: {
                name, description, price, duration, category,
                metadata, isActive, commitmentFee, pricingRules,
                // updatedAt is handled automatically by Prisma @updatedAt
            }
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { clientId: true }
        });

        if (!dbUser?.clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const existingService = await prisma.service.findUnique({
            where: { id: params.id },
            select: { clientId: true }
        });

        if (!existingService || existingService.clientId !== dbUser.clientId) {
            // Return success if already gone? Or 404? 
            // 404 is better for specific "delete this" request.
            return NextResponse.json({ error: 'Service not found or unauthorized' }, { status: 404 });
        }

        await prisma.service.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting service:', error);
        if (error.code === 'P2003') {
            return NextResponse.json({
                error: 'Cannot delete this service because it is linked to existing Jobs or Appointments.'
            }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
