import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            businessType: sectorId,
            businessInfo,
            services,
            branding,
            integrations
        } = body;

        if (!businessInfo?.email || !businessInfo?.name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const sector = await prisma.businessSector.findUnique({
            where: { id: sectorId }
        });

        let businessTypeEnum = 'OTHER';
        if (sector) {
            const code = sector.code.toUpperCase();
            const validTypes = ['AUTO_MECHANIC', 'RESTAURANT', 'SALON', 'HOTEL', 'RETAIL', 'HEALTHCARE'];
            if (validTypes.includes(code)) businessTypeEnum = code;
            if (code === 'AUTO_REPAIR') businessTypeEnum = 'AUTO_MECHANIC';
            if (code === 'REAL_ESTATE') businessTypeEnum = 'REAL_ESTATE';
        }

        const result = await prisma.$transaction(async (tx) => {
            const client = await tx.client.create({
                data: {
                    businessName: businessInfo.name,
                    businessType: businessTypeEnum as any,
                    sectorId: sector ? sector.id : undefined,
                    ownerName: businessInfo.owner,
                    phone: businessInfo.phone,
                    email: businessInfo.email,
                    address: businessInfo.address,
                    planTier: 'BASIC',
                    monthlyFee: 50000,
                    status: 'ACTIVE',
                },
            });

            await tx.user.create({
                data: {
                    email: businessInfo.email,
                    name: businessInfo.owner,
                    role: 'CLIENT',
                    clientId: client.id,
                },
            });

            if (branding) {
                await tx.branding.create({
                    data: {
                        clientId: client.id,
                        primaryColor: branding.primaryColor,
                        secondaryColor: branding.secondaryColor,
                        font: branding.font || 'Inter',
                        logoUrl: branding.logoUrl,
                    },
                });
            }

            if (services && services.length > 0) {
                await tx.service.createMany({
                    data: services.map((s: any) => ({
                        clientId: client.id,
                        name: s.name,
                        price: s.price || s.priceMin || 0,
                        isActive: true,
                    })),
                });
            }

            if (integrations) {
                await tx.integration.create({
                    data: {
                        clientId: client.id,
                        whatsappStatus: integrations.whatsapp ? 'pending' : 'disconnected',
                        paystackStatus: integrations.paystack ? 'pending' : 'disconnected',
                    }
                });
            }

            await tx.systemLog.create({
                data: {
                    level: 'INFO',
                    message: `New client "${businessInfo.name}" (${businessInfo.email}) onboarded successfully`,
                    clientId: client.id
                }
            });

            return client;
        });

        return NextResponse.json({ success: true, client: result });

    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Failed to create client', details: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clients = await prisma.client.findMany({
            include: {
                sector: true,
                _count: {
                    select: { customers: true, jobs: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}
