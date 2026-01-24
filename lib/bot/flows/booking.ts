import { ChatFlow, FlowResponse } from './types';
import prisma from '@/lib/prisma';
import { AvailabilityChecker } from '@/lib/services/booking/AvailabilityChecker';

export class BookingFlow implements ChatFlow {
    id = 'booking';

    async handle(
        step: string,
        message: string,
        data: Record<string, any>,
        context: { clientId: string; customerPhone: string; customerName?: string }
    ): Promise<FlowResponse> {
        const lowerMsg = message.toLowerCase();

        switch (step) {
            case 'start':
                // Initial trigger. Check if service was mentioned? 
                // For simplicity, always ask for service first unless we add NLU slot filling later.
                return {
                    response: "I can help you book an appointment. What service would you like to book? (e.g., Oil Change, Brake Check)",
                    nextStep: 'ask_service',
                    data: {}
                };

            case 'ask_service':
                // Search for service
                const service = await this.findService(context.clientId, message);
                if (!service) {
                    const availableServices = await prisma.service.findMany({
                        where: { clientId: context.clientId, isActive: true },
                        select: { name: true },
                        take: 5
                    });
                    const serviceList = availableServices.map(s => `- ${s.name}`).join('\n');

                    return {
                        response: `I couldn't find that service. Here are some services we offer:\n${serviceList}\n\nPlease type the name of the service you'd like.`,
                        nextStep: 'ask_service' // Stay on same step
                    };
                }
                return {
                    response: `Okay, ${service.name}. What date would you like to come in? (e.g., Tomorrow, Next Monday, or YYYY-MM-DD)`,
                    nextStep: 'ask_date',
                    data: { serviceId: service.id, serviceName: service.name, serviceDuration: service.duration }
                };

            case 'ask_date':
                const date = this.parseDate(message);
                if (!date) {
                    return {
                        response: "I didn't understand that date. Please try a format like 'Tomorrow' or '2024-05-20'.",
                        nextStep: 'ask_date'
                    };
                }
                // TODO: Check if date is valid (not past, open day)
                return {
                    response: `Great. What time works for you on ${date}? (e.g., 10am, 2:30pm)`,
                    nextStep: 'ask_time',
                    data: { date }
                };

            case 'ask_time':
                const time = this.parseTime(message);
                if (!time) {
                    return {
                        response: "Please enter a valid time (e.g., 9:00 AM or 14:00).",
                        nextStep: 'ask_time'
                    };
                }

                // Check availability
                const isAvailable = await this.checkAvailability(
                    context.clientId,
                    data.serviceId,
                    data.date,
                    time,
                    data.serviceDuration
                );

                if (!isAvailable) {
                    return {
                        response: "That slot is not available. Please choose another time.",
                        nextStep: 'ask_time'
                    };
                }

                // Ask for name if not known
                if (!context.customerName) {
                    return {
                        response: `Perfect. Time slot ${time} is available. May I have your name?`,
                        nextStep: 'ask_name',
                        data: { time }
                    };
                }

                // If name known, proceed to confirm directly
                return await this.confirmBooking(context, data.serviceId, data.serviceName, data.date, time, context.customerName);

            case 'ask_name':
                const name = message.trim();
                return await this.confirmBooking(context, data.serviceId, data.serviceName, data.date, data.time, name);

            default:
                return { response: "Something went wrong. Let's start over.", nextStep: undefined };
        }
    }

    private async confirmBooking(context: any, serviceId: string, serviceName: string, date: string, time: string, name: string): Promise<FlowResponse> {
        // Create Appointment
        try {
            // 1. Ensure customer exists (upsert)
            const customer = await prisma.customer.upsert({
                where: { clientId_phone: { clientId: context.clientId, phone: context.customerPhone } },
                update: { name },
                create: {
                    clientId: context.clientId,
                    phone: context.customerPhone,
                    name,
                    totalVisits: 0 // Will increment elsewhere
                }
            });

            // 2. Create Appointment
            await prisma.appointment.create({
                data: {
                    clientId: context.clientId,
                    customerId: customer.id,
                    customerName: name,
                    customerPhone: context.customerPhone,
                    serviceId,
                    date: new Date(date), // Note: Need proper ISO datetime combination
                    time,
                    status: 'CONFIRMED', // Auto-confirm for now
                    notes: 'Booked via WhatsApp Bot'
                }
            });

            return {
                response: `✅ Appointment Confirmed!\n\nService: ${serviceName}\nDate: ${date}\nTime: ${time}\n\nWe look forward to seeing you, ${name}!`,
                nextStep: undefined // End flow
            };

        } catch (error) {
            console.error('Booking failed', error);
            return {
                response: "I'm sorry, an error occurred while saving your booking. Please contact us directly.",
                nextStep: undefined,
                action: 'escalate'
            };
        }
    }

    // --- Helpers ---
    // (Simplistic implementations for prototype)
    private async findService(clientId: string, query: string) {
        // Simple fuzzy match or startsWith
        const services = await prisma.service.findMany({
            where: { clientId, isActive: true }
        });
        const lowerQuery = query.toLowerCase();
        return services.find(s => s.name.toLowerCase().includes(lowerQuery));
    }

    private parseDate(input: string): string | null {
        // TODO: Use 'chrono-node' or date-fns for relative dates
        // For now, accept YYYY-MM-DD or simple keywords
        const lower = input.toLowerCase();
        const today = new Date();

        if (lower.includes('tomorrow')) {
            const tmr = new Date(today);
            tmr.setDate(today.getDate() + 1);
            return tmr.toISOString().split('T')[0];
        }
        if (lower.includes('today')) {
            return today.toISOString().split('T')[0];
        }
        // Basic Regex for YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

        return null;
    }

    private parseTime(input: string): string | null {
        // Basic validator, returns HH:mm format
        if (/^\d{1,2}:\d{2}\s?(am|pm)?$/i.test(input)) return input; // Normalize this later
        if (/^\d{1,2}(am|pm)$/i.test(input)) return input;
        return null;
    }

    private async checkAvailability(clientId: string, serviceId: string, dateStr: string, timeStr: string, duration: number = 30): Promise<boolean> {
        // TODO: Use the real AvailabilityChecker
        return true;
    }
}
