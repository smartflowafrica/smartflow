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
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: { customer: true, client: true }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const clientId = (session.user as any).clientId;
        if (clientId && job.clientId !== clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { finalAmount, price, notes, description, priority, dueDate } = body;

        const clientId = (session.user as any).clientId;

        // Verify ownership
        const existingJob = await prisma.job.findUnique({
            where: { id: params.id },
            select: { clientId: true }
        });

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (clientId && existingJob.clientId !== clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const job = await prisma.job.update({
            where: { id: params.id },
            data: {
                ...(finalAmount !== undefined && { finalAmount }),
                ...(price !== undefined && { price }),
                ...(notes !== undefined && { notes }),
                ...(description !== undefined && { description }),
                ...(priority !== undefined && { priority }),
                ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
                updatedAt: new Date()
            }
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error updating job:', error);
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
}
