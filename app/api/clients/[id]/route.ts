import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify Admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const clientId = params.id;

        // Optional: Cleanup WhatsApp Instance
        try {
            const integration = await prisma.integration.findUnique({ where: { clientId } });
            if (integration?.whatsappInstanceId) {
                const whatsapp = new WhatsAppService(integration.whatsappInstanceId);
                await whatsapp.deleteInstance();
            }
        } catch (e) {
            console.error('Failed to cleanup WhatsApp instance', e);
            // Continue with DB deletion even if API fails
        }

        // Transactional Delete
        await prisma.$transaction(async (tx) => {
            // 1. Delete Users manually (since no Cascade)
            await tx.user.deleteMany({
                where: { clientId: clientId }
            });

            // 2. Delete Client (Cascades to Jobs, Appointments, Integration, etc.)
            await tx.client.delete({
                where: { id: clientId }
            });
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Client Error:', error);
        return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }
}
