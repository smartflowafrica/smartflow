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

        const { searchParams } = new URL(request.url);
        const branchId = searchParams.get('branchId');

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        if (!dbUser?.client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

        const whereClause: any = { clientId: dbUser.client.id };
        if (branchId) {
            whereClause.branchId = branchId;
        }

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: { customer: true, service: true },
            orderBy: { date: 'desc' },
            take: 50
        });

        return NextResponse.json(appointments);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

import { WhatsAppService } from '@/lib/api/evolution-whatsapp';
import { generateGoogleCalendarLink } from '@/lib/utils/calendar';

const whatsapp = new WhatsAppService();

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

        const body = await request.json();

        // Validate input
        const { appointmentSchema } = await import('@/lib/validators/booking');
        const validation = appointmentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.message }, { status: 400 });
        }

        const { customerId, serviceId, date, notes, branchId, customerPhone, customerName } = validation.data;

        // Fetch Service for details
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + (service.duration || 60) * 60000);

        const appointment = await prisma.appointment.create({
            data: {
                clientId: dbUser.client.id,
                branchId: branchId || undefined,
                customerId,
                serviceId,
                date: startTime,
                time: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                notes,
                customerPhone: body.customerPhone,
                customerName: body.customerName,
                status: 'SCHEDULED'
            }
        });

        // Send WhatsApp Notification (Async - do not block response)
        const clientContext = dbUser.client; // Capture non-null reference for closure
        (async () => {
            try {
                const link = generateGoogleCalendarLink({
                    title: `Appt: ${service.name} @ ${clientContext.businessName}`,
                    description: `Service: ${service.name}\nNotes: ${notes || 'None'}\n\nBooked via SmartFlow Africa`,
                    location: clientContext.address || '',
                    startTime,
                    endTime
                });

                const message = `✅ *Appointment Confirmed!*\n\n📅 *Date:* ${startTime.toLocaleDateString()}\n⏰ *Time:* ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n✂️ *Service:* ${service.name}\n📍 *Location:* ${clientContext.address || 'Business Location'}\n\nTap to add to Google Calendar:\n${link}`;

                await whatsapp.sendMessage(customerPhone, message, clientContext.id);
            } catch (err) {
                console.error("Failed to send appointment notification", err);
            }
        })();

        return NextResponse.json(appointment);

    } catch (error) {
        console.error('Create Appointment Error:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
