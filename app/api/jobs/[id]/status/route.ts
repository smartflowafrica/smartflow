import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status } = await request.json();
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
                status,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json(
            { error: 'Failed to update job status' },
            { status: 500 }
        );
    }
}
