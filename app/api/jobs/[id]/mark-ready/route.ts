import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get job details
        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: { client: true }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const clientId = (session.user as any).clientId;
        if (clientId && job.clientId !== clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update job to ready status
        await prisma.job.update({
            where: { id: params.id },
            data: {
                status: 'ready',
                updatedAt: new Date()
            }
        });

        // TODO: Send WhatsApp notification via Evolution API
        // This is now handled by /api/jobs/[id]/notify endpoint

        return NextResponse.json({
            success: true,
            message: 'Job marked as ready'
        });
    } catch (error) {
        console.error('Error marking job as ready:', error);
        return NextResponse.json(
            { error: 'Failed to mark job as ready' },
            { status: 500 }
        );
    }
}
