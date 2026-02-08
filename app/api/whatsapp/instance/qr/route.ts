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

        const instanceName = `client_${user.clientId}_v2`;

        const whatsapp = new WhatsAppService(instanceName);

        // Fetch QR Code / Connection Data
        let data = await whatsapp.connectInstance();
        console.log('[API] QR Data Received:', JSON.stringify(data, null, 2));

        // If connectInstance returned an error, propagate it as HTTP error
        if (data.status === 'ERROR') {
            console.error('[API] QR Connect Error:', data.error);
            return NextResponse.json(
                { error: data.error || 'Failed to connect to WhatsApp service' },
                { status: 502 }
            );
        }

        // Auto-recover: If no QR data (e.g. { count: 0 } = exhausted QR attempts),
        // delete the stale instance, recreate it, and retry once
        if (!data.base64 && !data.code) {
            console.warn('[API] No QR in response. Deleting stale instance and recreating...', JSON.stringify(data));

            try {
                // Logout first to clear WhatsApp session, then delete
                await whatsapp.logoutInstance();
                await new Promise(r => setTimeout(r, 1000));

                await whatsapp.deleteInstance();
                await new Promise(r => setTimeout(r, 2000));

                await whatsapp.createInstance(instanceName);
                console.log('[API] Instance recreated successfully');
                await new Promise(r => setTimeout(r, 2000));

                data = await whatsapp.connectInstance();
                console.log('[API] QR Data After Recreate:', JSON.stringify(data, null, 2));
            } catch (recoveryError: any) {
                console.error('[API] Recovery failed:', recoveryError);
                return NextResponse.json(
                    { error: `Instance recovery failed: ${recoveryError.message}` },
                    { status: 502 }
                );
            }

            if (!data.base64 && !data.code && data.status !== 'ERROR') {
                return NextResponse.json(
                    { error: `QR code unavailable after recreate. Evolution returned: ${JSON.stringify(data)}` },
                    { status: 502 }
                );
            }
            if (data.status === 'ERROR') {
                return NextResponse.json(
                    { error: data.error || 'Failed to connect after recreate' },
                    { status: 502 }
                );
            }
        }

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
