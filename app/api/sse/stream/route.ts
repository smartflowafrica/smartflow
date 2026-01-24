import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// SSE stream endpoint for realtime updates
export async function GET(request: NextRequest) {
    // Get the authenticated session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const userId = (session.user as any).id;
    const clientId = (session.user as any).clientId;

    // Create a readable stream for SSE
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            // Helper to send SSE event
            const sendEvent = (event: string, data: any) => {
                const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            // Send initial connection event
            sendEvent('connected', {
                message: 'SSE connection established',
                clientId,
                timestamp: new Date().toISOString()
            });

            // Track last known data for change detection
            let lastJobsHash = '';
            let lastConversationsHash = '';
            let lastAppointmentsHash = '';

            // Simple hash function for change detection
            const hashData = (data: any) => JSON.stringify(data).length.toString();

            // Polling function to check for updates
            const checkForUpdates = async () => {
                try {
                    if (!clientId) return;

                    // Fetch jobs
                    const jobs = await prisma.job.findMany({
                        where: { clientId },
                        orderBy: { updatedAt: 'desc' },
                        take: 50,
                        include: {
                            customer: {
                                select: { name: true, phone: true }
                            }
                        }
                    });
                    const jobsHash = hashData(jobs);
                    if (jobsHash !== lastJobsHash) {
                        lastJobsHash = jobsHash;
                        sendEvent('jobs', jobs);
                    }

                    // Fetch conversations (no customer relation, uses customerPhone/customerName directly)
                    const conversations = await prisma.conversation.findMany({
                        where: { clientId },
                        orderBy: { lastMessageAt: 'desc' },
                        take: 50,
                        include: {
                            _count: {
                                select: { messages: true }
                            }
                        }
                    });
                    const conversationsHash = hashData(conversations);
                    if (conversationsHash !== lastConversationsHash) {
                        lastConversationsHash = conversationsHash;
                        sendEvent('conversations', conversations);
                    }

                    // Fetch appointments
                    const appointments = await prisma.appointment.findMany({
                        where: { clientId },
                        orderBy: { date: 'asc' },
                        take: 50,
                        include: {
                            customer: {
                                select: { name: true, phone: true }
                            },
                            service: {
                                select: { name: true }
                            }
                        }
                    });
                    const appointmentsHash = hashData(appointments);
                    if (appointmentsHash !== lastAppointmentsHash) {
                        lastAppointmentsHash = appointmentsHash;
                        sendEvent('appointments', appointments);
                    }

                } catch (error) {
                    console.error('[SSE] Error fetching updates:', error);
                }
            };

            // Send initial data immediately
            await checkForUpdates();

            // Set up polling interval (every 3 seconds)
            const pollInterval = setInterval(async () => {
                await checkForUpdates();
            }, 3000);

            // Send heartbeat every 30 seconds to keep connection alive
            const heartbeatInterval = setInterval(() => {
                sendEvent('heartbeat', { timestamp: new Date().toISOString() });
            }, 30000);

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                clearInterval(pollInterval);
                clearInterval(heartbeatInterval);
                controller.close();
            });
        },
    });

    // Return SSE response
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable nginx buffering
        },
    });
}
