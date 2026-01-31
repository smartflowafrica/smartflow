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

        const instanceName = user.clientId!;
        const whatsapp = new WhatsAppService(instanceName);

        // Fetch QR Code / Connection Data
        const data = await whatsapp.connectInstance();
        console.log('[API] QR Data Received:', JSON.stringify(data, null, 2));

        // Evolution v1.8 usually returns { base64: "...", code: "..." }
        // If connected, it might return { instance: ..., status: "open" } without base64

        // Check local DB status too
        const integration = await prisma.integration.findUnique({
            where: { clientId: user.clientId }
        });

        return NextResponse.json({
            success: true,
            data: data,
            dbStatus: integration?.whatsappStatus
        });

    } catch (error: any) {
        console.error('Fetch QR Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
