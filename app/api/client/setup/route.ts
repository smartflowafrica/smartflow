import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { clientId, info, services, config, whatsapp } = body;

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        if (dbUser?.role !== 'ADMIN' && dbUser?.client?.id !== clientId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 1. Look up Sector to get the correct Enum Code and Relation ID
        let sectorId = info?.type;
        let businessTypeEnum = 'OTHER';

        if (sectorId) {
            const sector = await prisma.businessSector.findUnique({
                where: { id: sectorId }
            });

            if (sector) {
                const code = sector.code.toUpperCase();
                // Valid Enums matching BusinessType
                const validTypes = ['AUTO_MECHANIC', 'RESTAURANT', 'SALON', 'HOTEL', 'RETAIL', 'HEALTHCARE', 'REAL_ESTATE', 'EDUCATION', 'LOGISTICS', 'FITNESS', 'PROFESSIONAL_SERVICES'];

                if (validTypes.includes(code)) businessTypeEnum = code;
                if (code === 'AUTO_REPAIR') businessTypeEnum = 'AUTO_MECHANIC'; // Map legacy code
            }
        }

        await prisma.$transaction(async (tx: any) => {
            await tx.client.update({
                where: { id: clientId },
                data: {
                    businessName: info?.name,
                    businessType: businessTypeEnum as any, // Set correct Enum
                    sectorId: sectorId, // Link the Relation
                    ownerName: info?.owner,
                    phone: info?.phone,
                    address: info?.address || config?.address,
                    hours: config?.hours,
                    metadata: {
                        onboardingComplete: true,
                        deliveryOptions: config?.deliveryOptions,
                        whatsappConfig: whatsapp
                    }
                }
            });


            // Only create services if onboarding is NOT already complete (Idempotency Check)
            const clientData = await tx.client.findUnique({ where: { id: clientId } });
            const isOnboardingAlreadyComplete = clientData?.metadata && (clientData.metadata as any).onboardingComplete;

            if (!isOnboardingAlreadyComplete && Array.isArray(services) && services.length > 0) {
                // Check if services already exist to be double sure
                const existingCount = await tx.service.count({ where: { clientId } });

                if (existingCount === 0) {
                    await tx.service.createMany({
                        data: services.map((s: any) => ({
                            clientId,
                            name: s.name,
                            description: s.description,
                            price: parseFloat(s.price),
                            category: s.category,
                            duration: 30,
                            isActive: true
                        }))
                    });
                }
            }
        });

        revalidatePath('/client', 'layout');

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Onboarding Setup Error:', error);
        return NextResponse.json({ error: error.message || 'Setup failed' }, { status: 500 });
    }
}
