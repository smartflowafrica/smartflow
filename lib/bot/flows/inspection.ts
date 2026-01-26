import { ChatFlow, FlowResponse } from './types';
import prisma from '@/lib/prisma';
import { isFuzzyMatch } from '@/lib/utils/fuzzy';

// Helper to find partial match in pricing rules
const findPriceForLocation = (rules: any[], userLocation: string): number | null => {
    if (!rules || !Array.isArray(rules)) return null;
    const lowerLoc = userLocation.toLowerCase();

    // Check exact or partial match
    const match = rules.find(r =>
        r.location?.toLowerCase().includes(lowerLoc) ||
        lowerLoc.includes(r.location?.toLowerCase())
    );

    return match ? Number(match.price) : null;
};

export class InspectionFlow implements ChatFlow {
    id = 'inspection';

    async handle(
        step: string,
        message: string,
        data: Record<string, any>,
        context: { clientId: string; customerPhone: string; customerName?: string }
    ): Promise<FlowResponse> {
        const lowerMsg = message.toLowerCase();

        switch (step) {
            case 'start':
                return {
                    response: "I can help with the pre-purchase inspection. To give you an accurate quote, where is the car located? (e.g., Lekki Phase 1, Ikeja, Kubwa)",
                    nextStep: 'ask_location',
                    data: {}
                };

            case 'ask_location':
                const location = message.trim();
                let price = null;
                let serviceId = data.serviceId;

                // 1. Try to find the Inspection Service if not already passed
                if (!serviceId) {
                    const service = await prisma.service.findFirst({
                        where: {
                            clientId: context.clientId,
                            isActive: true,
                            OR: [
                                { name: { contains: 'Inspection', mode: 'insensitive' } },
                                { category: 'Inspection' }
                            ]
                        }
                    });
                    if (service) {
                        serviceId = service.id;
                        // 2. Check Pricing Rules
                        price = findPriceForLocation((service.pricingRules as any) || [], location);
                    }
                }

                return {
                    response: "Got it. What is the Make, Model, and Year of the car? (e.g., Toyota Camry 2015)",
                    nextStep: 'ask_car_details',
                    data: { location, price, serviceId }
                };

            case 'ask_car_details':
                const carDetails = message.trim();
                return {
                    response: "When would you like the inspection to happen? (e.g., Tomorrow, Monday at 10am)",
                    nextStep: 'ask_date',
                    data: { ...data, carDetails }
                };

            case 'ask_date':
                const dateStr = message.trim();
                return await this.finalizeRequest(context, { ...data, dateStr });

            default:
                return { response: "Something went wrong. Let's start over.", nextStep: undefined };
        }
    }

    private async finalizeRequest(context: any, data: any): Promise<FlowResponse> {
        const { location, price, carDetails, dateStr, serviceId } = data;

        // 1. Create/Update Customer
        let customer = await prisma.customer.findUnique({
            where: { clientId_phone: { clientId: context.clientId, phone: context.customerPhone } }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    clientId: context.clientId,
                    phone: context.customerPhone,
                    name: context.customerName || 'New Lead'
                }
            });
        }

        // 2. Create Appointment (or Lead)
        // If we found a price, we can treat it as a confirmed/scheduled booking logic
        // If no price, it's a "Request"

        await prisma.appointment.create({
            data: {
                clientId: context.clientId,
                customerId: customer.id,
                customerName: customer.name,
                customerPhone: customer.phone,
                // If serviceId specific inspection service exists, use it, else fallback or might error if required
                // For now, assume we found it or skip. Ideally we insert a "Custom" service or similar.
                serviceId: serviceId, // Need a valid service ID.
                date: new Date(), // Placeholder, real date parsing needed
                time: "TBD",
                status: 'SCHEDULED', // Using SCHEDULED for now
                notes: `[Inspection Request]
Car: ${carDetails}
Location: ${location}
Requested Date: ${dateStr}
Quote: ${price ? '₦' + price.toLocaleString() : 'PENDING'}`,
            }
        });

        let reply = "";
        if (price) {
            reply = `Thank you! Based on the location (${location}), the inspection cost is ₦${price.toLocaleString()}.\n\nWe have received your request for the ${carDetails}. An agent will contact you shortly to confirm the appointment for ${dateStr} and process payment.`;
        } else {
            reply = `Thank you! We have received your request for the ${carDetails} inspection at ${location}.\n\nSince pricing depends on the exact location, one of our engineers will review this and send you a quote shortly.`;
        }

        return {
            response: reply,
            nextStep: undefined,
            // Trigger escalation so agent sees it immediately?
            // action: 'escalate' 
        };
    }
}
