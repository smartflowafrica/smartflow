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

        // STRATEGY: Check Standard Name -> Check Legacy Name -> Return Status
        // 1. Check Standard Name: client_{clientId}
        const standardName = `client_${user.clientId}_v2`;
        let usedInstanceName = standardName;
        let whatsapp = new WhatsAppService(standardName);
        let statusData = await whatsapp.getInstanceStatus();
        let actualState = statusData?.instance?.state || statusData?.state || 'unknown';

        // 2. If Not Found, Check Legacy Name: {clientId} (No prefix)
        // This handles existing users who connected before we standardized the naming
        if (actualState === 'not_found' || actualState === 'unknown') {
            const legacyName = user.clientId!;
            console.log(`[API] Standard instance ${standardName} not found. Checking legacy: ${legacyName}`);

            const legacyWhatsapp = new WhatsAppService(legacyName);
            const legacyStatus = await legacyWhatsapp.getInstanceStatus();
            const legacyState = legacyStatus?.instance?.state || legacyStatus?.state;

            if (legacyState && legacyState !== 'not_found' && legacyState !== 'unknown') {
                console.log(`[API] Found Legacy Instance: ${legacyName} (State: ${legacyState})`);
                // Switch to using this one
                whatsapp = legacyWhatsapp;
                statusData = legacyStatus;
                actualState = legacyState;
                usedInstanceName = legacyName;

                // Auto-Heal: Update DB to point to this valid instance
                await prisma.integration.upsert({
                    where: { clientId: user.clientId },
                    update: { whatsappInstanceId: legacyName },
                    create: { clientId: user.clientId!, whatsappInstanceId: legacyName }
                });
            }
        }

        console.log('[API] Final Status Data:', JSON.stringify(statusData));
        const errorDetail = statusData?.instance?.error || statusData?.error;

        // Sync Status with DB
        if (actualState && actualState !== 'unreachable' && actualState !== 'error') {
            const normalizedStatus = actualState === 'open' ? 'connected' : 'disconnected';

            await prisma.integration.upsert({
                where: { clientId: user.clientId },
                update: { whatsappStatus: normalizedStatus, whatsappInstanceId: usedInstanceName },
                create: { clientId: user.clientId!, whatsappStatus: normalizedStatus, whatsappInstanceId: usedInstanceName }
            });
        }

        return NextResponse.json({
            success: true,
            state: actualState,
            error: errorDetail,
            instanceName: usedInstanceName
        });




    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
