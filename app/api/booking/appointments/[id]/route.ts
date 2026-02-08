import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { WhatsAppService } from '@/lib/api/evolution-whatsapp';
import { generateGoogleCalendarLink } from '@/lib/utils/calendar';

// Removed static initialization
// const whatsapp = new WhatsAppService();

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
            include: {
                client: {
                    include: { integrations: true } // Include integrations to get WhatsApp Instance ID
                }
            }
        });

        if (!dbUser?.client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

        const body = await request.json();
        const { date, time, notes } = body;

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

        const startTime = new Date(date);

        const updatedAppt = await prisma.appointment.update({
            where: { id: params.id },
            data: {
                date: startTime,
                time: time,
                notes: notes,
                status: 'SCHEDULED'
            }
        });

        // 2. Notify Customer
        const clientContext = dbUser.client;
        const whatsappInstanceId = clientContext.integrations?.whatsappInstanceId;

        // Only send if instance is configured
        if (whatsappInstanceId) {
            (async () => {
                try {
                    const whatsapp = new WhatsAppService(whatsappInstanceId); // Use Dynamic Instance
                    const service = existingAppt.service;
                    const endTime = new Date(startTime.getTime() + (service.duration || 60) * 60000);

                    const link = generateGoogleCalendarLink({
                        title: `Rescheduled: ${service.name} @ ${clientContext.businessName}`,
                        description: `Service: ${service.name}\nNotes: ${notes || existingAppt.notes || 'None'}\n\nRescheduled via SmartFlow Africa`,
                        location: clientContext.address || '',
                        startTime,
                        endTime
                    });

                    const message = `🔄 *Appointment Rescheduled*\n\nYour appointment has been updated.\n\n📅 *New Date:* ${startTime.toLocaleDateString()}\n⏰ *New Time:* ${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}\n✂️ *Service:* ${service.name}\n\nTap to update Google Calendar:\n${link}`;

                    await whatsapp.sendMessage(existingAppt.customerPhone, message, clientContext.id);
                } catch (err) {
                    console.error("Failed to send reschedule notification", err);
                }
            })();
        } else {
            console.log('[Reschedule] No WhatsApp Instance configured for client, skipping notification.');
        }

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

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true } // Integrations not strictly needed for logic but good for consistency if we added notify on cancel
        });

        const existingAppt = await prisma.appointment.findUnique({ where: { id: params.id } });
        if (!existingAppt || existingAppt.clientId !== dbUser?.client?.id) {
            return NextResponse.json({ error: 'Not found or Forbidden' }, { status: 404 });
        }

        const cancelledAppt = await prisma.appointment.update({
            where: { id: params.id },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json(cancelledAppt);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
    }
}
