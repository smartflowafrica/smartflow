import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user || !user.clientId) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const instanceName = `client_${user.clientId}`;
        const whatsapp = new WhatsAppService(instanceName);

        // Fetch Real-time Status
        const statusData = await whatsapp.getInstanceStatus();
        // Format: { instance: "...", state: "open" | "close" | "connecting" }

        // Sync with DB if needed
        if (statusData && statusData.state) {
            const normalizedStatus = statusData.state === 'open' ? 'connected' : 'disconnected';

            await prisma.integration.update({
                where: { clientId: user.clientId },
                data: { whatsappStatus: normalizedStatus }
            });
        }

        return NextResponse.json({
            success: true,
            state: statusData?.state || 'unknown'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
