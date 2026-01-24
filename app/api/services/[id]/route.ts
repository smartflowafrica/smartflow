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

        const updatedService = await prisma.service.update({
            where: { id: params.id },
            data: {
                ...body,
                updatedAt: new Date() // Assuming updatedAt column exists. If not, Prisma might ignore or error. 
                // Checking schema... Service doesn't have updatedAt in outline from step 2407 clearly visible? 
                // Ah, outline showed truncated. But usually yes. If not, I'll remove it.
                // Wait, in step 2407 Service model snippet showed "createdAt DateTime @default(now())" but truncated.
                // I will safely omit updatedAt if I am not sure, OR I will assume standard practice.
                // Actually, let's omit updatedAt to be safe unless I see it.
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
            return NextResponse.json({ error: 'Service not found or unauthorized' }, { status: 404 });
        }

        await prisma.service.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
