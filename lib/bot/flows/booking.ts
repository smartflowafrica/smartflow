import { ChatFlow, FlowResponse } from './types';
import prisma from '@/lib/prisma';
import { AvailabilityChecker } from '@/lib/services/booking/AvailabilityChecker';
import { initializePaystackPayment } from '@/lib/paystack';

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
                // 1. Check if Service was already identified by MessageProcessor
                if (data.serviceId && data.serviceName) {
                    const service = {
                        id: data.serviceId,
                        name: data.serviceName,
                        duration: data.serviceDuration,
                        category: data.serviceCategory, // Assuming we pass this or fetch it
                        pricingRules: data.pricingRules
                    };

                    // Ask for location if Inspection category OR has pricingRules (re-using logic validation if needed)
                    // But simpler: just trust the data or re-fetch fully if we need category/rules that might be missing in data
                    // Let's re-fetch to be safe and get category/pricingRules
                    const fullService = await prisma.service.findUnique({ where: { id: data.serviceId } });

                    if (fullService) {
                        const hasPricingRules = (fullService as any).pricingRules && (fullService as any).pricingRules.length > 0;
                        const isInspection = fullService.category === 'Inspection';

                        if (isInspection || hasPricingRules) {
                            return {
                                response: `Okay, ${fullService.name}. Where is the vehicle located? (e.g., Lekki, Ikeja)`,
                                nextStep: 'ask_location',
                                data: {
                                    serviceId: fullService.id,
                                    serviceName: fullService.name,
                                    serviceDuration: fullService.duration,
                                    pricingRules: (fullService as any).pricingRules || []
                                }
                            };
                        }

                        return {
                            response: `Okay, ${fullService.name}. What date would you like to come in? (e.g., Tomorrow, Next Monday, or YYYY-MM-DD)`,
                            nextStep: 'ask_date',
                            data: { serviceId: fullService.id, serviceName: fullService.name, serviceDuration: fullService.duration }
                        };
                    }
                }

                // Attempt to match service immediately from the trigger message
                if (message && message.toLowerCase() !== 'menu' && message.toLowerCase() !== 'hi' && message.toLowerCase() !== 'hello') {
                    const service = await this.findService(context.clientId, message);
                    if (service) {
                        // Ask for location if Inspection category OR has pricingRules
                        const hasPricingRules = (service as any).pricingRules && (service as any).pricingRules.length > 0;
                        const isInspection = service.category === 'Inspection';

                        if (isInspection || hasPricingRules) {
                            return {
                                response: `Okay, ${service.name}. Where is the vehicle located? (e.g., Lekki, Ikeja)`,
                                nextStep: 'ask_location',
                                data: {
                                    serviceId: service.id,
                                    serviceName: service.name,
                                    serviceDuration: service.duration,
                                    pricingRules: (service as any).pricingRules || []
                                }
                            };
                        }

                        return {
                            response: `Okay, ${service.name}. What date would you like to come in? (e.g., Tomorrow, Next Monday, or YYYY-MM-DD)`,
                            nextStep: 'ask_date',
                            data: { serviceId: service.id, serviceName: service.name, serviceDuration: service.duration }
                        };
                    }
                }

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
                    const serviceList = availableServices.map((s: any) => `- ${s.name}`).join('\n');

                    return {
                        response: `I couldn't find that service. Here are some services we offer:\n${serviceList}\n\nPlease type the name of the service you'd like.`,
                        nextStep: 'ask_service' // Stay on same step
                    };
                }
                // Ask for location if Inspection category OR has pricingRules
                const hasPricingRules = (service as any).pricingRules && (service as any).pricingRules.length > 0;
                const isInspection = service.category === 'Inspection';

                if (isInspection || hasPricingRules) {
                    return {
                        response: `Okay, ${service.name}. Where is the vehicle located? (e.g., Lekki, Ikeja)`,
                        nextStep: 'ask_location',
                        data: {
                            serviceId: service.id,
                            serviceName: service.name,
                            serviceDuration: service.duration,
                            pricingRules: (service as any).pricingRules || []
                        }
                    };
                }

                return {
                    response: `Okay, ${service.name}. What date would you like to come in? (e.g., Tomorrow, Next Monday, or YYYY-MM-DD)`,
                    nextStep: 'ask_date',
                    data: { serviceId: service.id, serviceName: service.name, serviceDuration: service.duration }
                };

            case 'ask_location':
                const location = message.trim();
                let matchedPrice = 0;
                let priceSource = 'Base Price';

                // improved location matching logic
                if (data.pricingRules && data.pricingRules.length > 0) {
                    const lowerLoc = location.toLowerCase();
                    const rule = data.pricingRules.find((r: any) => lowerLoc.includes(r.location.toLowerCase()) || r.location.toLowerCase().includes(lowerLoc));
                    if (rule) {
                        matchedPrice = Number(rule.price);
                        priceSource = `Location: ${rule.location}`;
                    }
                }

                const priceMsg = matchedPrice > 0 ? ` (Est: ₦${matchedPrice.toLocaleString()})` : '';

                return {
                    response: `Got it. Inspection at ${location}${priceMsg}. What date would you like to come in? (e.g., Tomorrow, Next Monday)`,
                    nextStep: 'ask_date',
                    data: { ...data, location, matchedPrice }
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
                return await this.confirmBooking(context, data.serviceId, data.serviceName, data.date, time, context.customerName, data.matchedPrice, data.location);

            case 'ask_name':
                const name = message.trim();
                return await this.confirmBooking(context, data.serviceId, data.serviceName, data.date, data.time, name, data.matchedPrice, data.location);

            default:
                return { response: "Something went wrong. Let's start over.", nextStep: undefined };
        }
    }

    private async confirmBooking(
        context: any,
        serviceId: string,
        serviceName: string,
        date: string,
        time: string,
        name: string,
        matchedPrice?: number,
        location?: string
    ): Promise<FlowResponse> {
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

            // 2. Fetch Service to check for Fee
            const service = await prisma.service.findUnique({ where: { id: serviceId } });

            // Priority: Explicit Commitment Fee > matchedPrice (only if explicit fee missing) > 0
            // If the service has a commitment fee (e.g. 100k), we should use THAT as the fee, 
            // even if matchedPrice (e.g. 150k location price) is higher.
            const baseFee = (service as any)?.commitmentFee ? Number((service as any).commitmentFee) : 0;

            let fee = baseFee;
            // Only fall back to matchedPrice if no specific commitment fee is set
            if (fee === 0 && matchedPrice !== undefined) {
                fee = matchedPrice;
            }

            let status: any = 'CONFIRMED';
            let paymentLink = null;

            if (fee > 0) {
                status = 'PENDING_PAYMENT';
            }

            const notes = [
                fee > 0 ? `Commitment Fee: ₦${fee.toLocaleString()}` : null,
                location ? `Location: ${location}` : null,
                'Booked via WhatsApp Bot'
            ].filter(Boolean).join('\n');

            // 3. Create Appointment
            const appointment = await prisma.appointment.create({
                data: {
                    clientId: context.clientId,
                    customerId: customer.id,
                    customerName: name,
                    customerPhone: context.customerPhone,
                    serviceId,
                    date: new Date(date),
                    time,
                    status,
                    notes
                }
            });


            // 3b. Create Job (Invoice Record)
            const job = await prisma.job.create({
                data: {
                    clientId: context.clientId,
                    customerId: customer.id,
                    customerName: name,
                    customerPhone: context.customerPhone,
                    description: `Booking: ${serviceName}`,
                    status: 'PENDING',
                    paymentStatus: fee > 0 ? 'PENDING' : 'PAID', // Pending payment if fee > 0
                    price: fee > 0 ? fee : (Number(service?.price) || 0), // Use fee or service price
                    priority: 'MEDIUM',
                    branchId: service?.branchId,
                    metadata: {
                        appointmentId: appointment.id,
                        source: 'whatsapp_bot',
                        type: 'booking_invoice'
                    }
                }
            });

            // 4. Generate Payment Link if Fee > 0
            if (fee > 0) {
                let paymentLink = null;
                let bankDetails = null;

                try {
                    // Fetch Client Settings & Integration
                    const client = await prisma.client.findUnique({
                        where: { id: context.clientId },
                        include: { integrations: true, branding: true } // Include branding for bank details
                    });

                    // Check for bank details in branding or metadata
                    const meta = client?.metadata as any;
                    const branding = client?.branding;

                    if (branding?.bankDetails) {
                        const bank = branding.bankDetails as any;
                        if (bank.bankName && bank.accountNumber) {
                            bankDetails = `Bank: ${bank.bankName}\nAccount: ${bank.accountNumber}\nName: ${bank.accountName || client?.businessName}`;
                        }
                    } else if (meta?.bankName && meta?.accountNumber) {
                        // Fallback to metadata
                        bankDetails = `Bank: ${meta.bankName}\nAccount: ${meta.accountNumber}\nName: ${meta.accountName || client?.businessName}`;
                    }

                    // Use client key if available, otherwise undefined (will fallback to env in lib/paystack)
                    const paystackKey = client?.integrations?.paystackSecretKey || undefined;

                    // If no key configured, skip directly to invoice
                    if (!paystackKey && !process.env.PAYSTACK_SECRET_KEY) {
                        throw new Error('Paystack not configured');
                    }

                    const payment = await initializePaystackPayment({
                        email: customer.email || `${context.customerPhone}@smartflow.app`, // Fallback email
                        amount: fee * 100, // Convert to kobo
                        reference: `r-${appointment.id}-${Date.now()}`,
                        metadata: {
                            appointmentId: appointment.id,
                            clientId: context.clientId,
                            type: 'COMMITMENT_FEE',
                            jobId: job.id // Link payment to job
                        }
                    }, paystackKey);

                    paymentLink = payment.data.authorization_url;

                } catch (pxError: any) {
                    console.error('Paystack initialization skipped/failed:', pxError.message);

                    // Generate Text Invoice Fallback with PDF Link
                    const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/public/invoices/${job.id}`;

                    const invoiceMsg = [
                        `✅ Appointment Reserved!`,
                        ``,
                        `📄 **INVOICE GENERATED**`,
                        `Service: ${serviceName}`,
                        `Date: ${date} @ ${time}`,
                        `Amount Due: ₦${fee.toLocaleString()}`,
                        ``,
                        `🔗 **Download Invoice:** ${invoiceUrl}`,
                        ``,
                        bankDetails ? `Please make a transfer to:\n${bankDetails}` : `An agent will contact you shortly with payment details.`,
                        ``,
                        `⚠️ Please send proof of payment here to confirm your booking.`
                    ].join('\n');

                    return {
                        response: invoiceMsg,
                        nextStep: undefined,
                        action: 'escalate' // Flag for human follow-up
                    };
                }

                return {
                    response: `✅ Appointment Reserved!\n\nService: ${serviceName}\nDate: ${date}\nTime: ${time}\n\n⚠️ **Action Required**: A commitment fee of ₦${fee.toLocaleString()} is required to confirm this booking.\n\nPlease pay here: ${paymentLink}`,
                    nextStep: undefined
                };
            }

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
    private async findService(clientId: string, query: string) {
        // Simple fuzzy match or startsWith
        const services = await prisma.service.findMany({
            where: { clientId, isActive: true }
        });
        const lowerQuery = query.toLowerCase();
        return services.find((s: any) => s.name.toLowerCase().includes(lowerQuery));
    }

    private parseDate(input: string): string | null {
        // TODO: Use 'chrono-node' or date-fns for relative dates
        // For now, accept YYYY-MM-DD or simple keywords
        const lower = input.toLowerCase();
        const today = new Date();

        // Handle common typos for tomorrow
        if (lower.includes('tomorrow') || lower.includes('tommorrow') || lower.includes('tomorow') || lower.includes('tmr')) {
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
