import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        if (!dbUser?.client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

        const settings = await prisma.client.findUnique({
            where: { id: dbUser.client.id },
            include: {
                bookingRule: true,
                timeSlots: { orderBy: { dayOfWeek: 'asc' } }
            }
        });

        return NextResponse.json(settings);

    } catch (error) {
        console.error('Fetch Booking Settings Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        if (!dbUser?.client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        const clientId = dbUser.client.id;

        const body = await request.json();
        const { rules, slots } = body;

        if (rules) {
            await prisma.bookingRule.upsert({
                where: { clientId },
                create: { ...rules, clientId },
                update: { ...rules }
            });
        }

        if (slots && Array.isArray(slots)) {
            await prisma.$transaction(async (tx: any) => {
                await tx.timeSlot.deleteMany({ where: { clientId } });
                if (slots.length > 0) {
                    await tx.timeSlot.createMany({
                        data: slots.map((s: any) => ({
                            clientId,
                            dayOfWeek: s.dayOfWeek,
                            startTime: s.startTime,
                            endTime: s.endTime,
                            resourceId: s.resourceId
                        }))
                    });
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update Booking Settings Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
