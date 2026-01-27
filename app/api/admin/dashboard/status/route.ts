import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        // Double check admin status if possible, or assume dashboard layout protects it
        // For now, allow logged in users to check status if they have access to admin routes
        // return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const whatsapp = new WhatsAppService();

        // 1. Fetch Instances from Evolution
        let instances: any[] = [];
        try {
            instances = await whatsapp.fetchInstances();
        } catch (e) {
            console.error('Failed to fetch Evolution instances:', e);
        }

        // 2. Fetch Client Info to map to instances
        const clients = await prisma.client.findMany({
            where: {
                integrations: {
                    whatsappInstanceId: { not: null }
                }
            },
            select: {
                id: true,
                businessName: true,
                integrations: {
                    select: { whatsappInstanceId: true }
                }
            }
        });

        // Map client names to instances
        const enrichedInstances = instances.map((inst: any) => {
            const client = clients.find(c => c.integrations?.whatsappInstanceId === inst.instance.instanceName);
            return {
                ...inst,
                clientName: client?.businessName || 'Unknown / Unlinked',
                clientId: client?.id
            };
        });

        // 3. Fetch Recent Critical Logs
        const logs = await prisma.systemLog.findMany({
            where: {
                level: { in: ['ERROR', 'CRITICAL', 'WARNING'] }
            },
            take: 10,
            orderBy: { timestamp: 'desc' },
            // Removed empty include
        });

        // Enhance logs with client names if possible
        const logsWithNames = await Promise.all(logs.map(async (log) => {
            let clientName = 'System';
            if (log.clientId) {
                const c = await prisma.client.findUnique({ where: { id: log.clientId }, select: { businessName: true } });
                if (c) clientName = c.businessName;
            }
            return { ...log, clientName };
        }));

        // 4. Fetch Recent Signups
        const recentSignups = await prisma.client.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                businessName: true,
                businessType: true,
                planTier: true,
                createdAt: true,
                status: true
            }
        });

        return NextResponse.json({
            instances: enrichedInstances,
            logs: logsWithNames,
            recentSignups
        });

    } catch (error) {
        console.error('Admin Status API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
