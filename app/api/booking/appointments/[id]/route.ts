import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';
import { generateGoogleCalendarLink } from '@/lib/utils/calendar';

const whatsapp = new WhatsAppService();

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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
        const { date, time, notes } = body; // Reschedule mainly changes date/time

        // 1. Get existing appointment
        const existingAppt = await prisma.appointment.findUnique({
            where: { id: params.id },
            include: { service: true }
        });

        if (!existingAppt) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });

        // Verify ownership
        if (existingAppt.clientId !== dbUser.client.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const startTime = new Date(date); // date should be full ISO from frontend
        // If frontend sends separated date/time, handle it. 
        // Assuming frontend sends something like "2026-01-24T14:30:00" as `date` which essentially combines both for the DB `date` field?
        // Wait, DB `date` is usually Start of Day in typical setups if `time` is separate, BUT `new Date(string)` keeps time if provided.
        // In previous POST route, `startTime` was `new Date(date)` and `time` string was extracted.
        // Let's stick to that pattern.

        const updatedAppt = await prisma.appointment.update({
            where: { id: params.id },
            data: {
                date: startTime,
                time: time, // e.m. "14:30"
                notes: notes,
                status: 'SCHEDULED' // Reset status to scheduled if it was confirmed/cancelled? Or keep existing? Usually reschedule implies re-confirming implicitly if by admin.
            }
        });

        // 2. Notify Customer
        (async () => {
            try {
                const service = existingAppt.service;
                const endTime = new Date(startTime.getTime() + (service.duration || 60) * 60000);

                const link = generateGoogleCalendarLink({
                    title: `Rescheduled: ${service.name} @ ${dbUser.client.businessName}`,
                    description: `Service: ${service.name}\nNotes: ${notes || existingAppt.notes || 'None'}\n\nRescheduled via SmartFlow Africa`,
                    location: dbUser.client.address || '',
                    startTime,
                    endTime
                });

                const message = `🔄 *Appointment Rescheduled*\n\nYour appointment has been updated.\n\n📅 *New Date:* ${startTime.toLocaleDateString()}\n⏰ *New Time:* ${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}\n✂️ *Service:* ${service.name}\n\nTap to update Google Calendar:\n${link}`;

                await whatsapp.sendMessage(existingAppt.customerPhone, message, dbUser.client.id);
            } catch (err) {
                console.error("Failed to send reschedule notification", err);
            }
        })();

        return NextResponse.json(updatedAppt);

    } catch (error) {
        console.error('Update Appointment Error:', error);
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // ... verify ownership similar to PUT ...
        // For brevity assuming verified or trusting middleware-like logic for now in prototype
        // But let's be safe:
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        const existingAppt = await prisma.appointment.findUnique({ where: { id: params.id } });
        if (!existingAppt || existingAppt.clientId !== dbUser?.client?.id) {
            return NextResponse.json({ error: 'Not found or Forbidden' }, { status: 404 });
        }

        // We usually soft delete or mark cancelled
        const cancelledAppt = await prisma.appointment.update({
            where: { id: params.id },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json(cancelledAppt);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
    }
}
