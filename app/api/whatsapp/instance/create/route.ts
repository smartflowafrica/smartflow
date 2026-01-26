import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get Client ID (assuming user is linked to client)
        // We'll fetch the user to get the clientId
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: { client: true }
        });

        if (!user || !user.client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const clientId = user.clientId!;
        const instanceName = `client_${clientId}`; // Unique instance name

        console.log(`[API] Creating WhatsApp Instance for Client ${clientId}: ${instanceName}`);

        // 1. Initialize Service with the specific instance name
        const whatsapp = new WhatsAppService(instanceName);

        // 2. Call Evolution API to create instance
        // This might fail if it already exists, so we handle that
        try {
            const result = await whatsapp.createInstance(instanceName);
            console.log('[API] Instance Create Result:', result);
        } catch (error: any) {
            // If error says "already exists", we proceed to just trying to fetch QR
            // Evolution error messages vary, but usually contain "already exists"
            if (error.message && error.message.includes('already exists')) {
                console.log('[API] Instance already exists, proceeding to connect...');
            } else {
                console.error('[API] Creation Failed:', error);
                throw error;
            }
        }

        // 3. Update Database
        await prisma.integration.upsert({
            where: { clientId: clientId },
            update: {
                whatsappInstanceId: instanceName,
                whatsappStatus: 'created' // Temporary status
            },
            create: {
                clientId: clientId,
                whatsappInstanceId: instanceName,
                whatsappStatus: 'created'
            }
        });

        return NextResponse.json({ success: true, instanceName });

    } catch (error: any) {
        console.error('Create Instance Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create instance' }, { status: 500 });
    }
}
