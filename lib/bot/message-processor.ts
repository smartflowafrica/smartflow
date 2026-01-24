import prisma from '@/lib/prisma';
import { templates, formatMenu, formatHours, getOpenStatus } from './templates';
import { faqMatcher } from './faq-matcher';
import { FlowEngine } from './flows/engine';

export interface ProcessedMessage {
    response: string;
    mediaUrls?: string[]; // Supports multiple images
    confidence: number; // 0-100
    action: 'reply' | 'escalate' | 'request_info';
    metadata?: any;
}

export interface MessageContext {
    clientId: string;
    customerPhone: string;
    customerName?: string;
}

export class MessageProcessor {
    private flowEngine = new FlowEngine();

    /**
     * Main entry point to process an incoming message
     */
    public async processMessage(
        message: string,
        customerPhone: string,
        clientId: string
    ): Promise<ProcessedMessage> {
        try {
            const context: MessageContext = { clientId, customerPhone };

            // 0. Check for Active Flow
            const flowResult = await this.flowEngine.handleMessage(clientId, customerPhone, message);
            if (flowResult) {
                console.log(`[MessageProcessor] Handled by FlowEngine`);
                return {
                    response: flowResult.response,
                    confidence: 100,
                    action: flowResult.action || 'reply',
                    metadata: { source: 'flow_engine', ...flowResult.data }
                };
            }

            // 1. Check FAQs first (business-specific answers)
            const faqMatch = await faqMatcher.findMatch(message, clientId);
            if (faqMatch && faqMatch.confidence >= 60) {
                console.log(`[MessageProcessor] FAQ Match (${faqMatch.confidence}%): ${message}`);
                return {
                    response: faqMatch.answer,
                    confidence: faqMatch.confidence,
                    action: 'reply',
                    metadata: { source: 'faq' }
                };
            }

            // 2. Check for Service Name Match (Trigger Booking)
            const serviceMatch = await this.findServiceMatch(clientId, message);
            if (serviceMatch) {
                console.log(`[MessageProcessor] Service Match: ${serviceMatch.name}`);
                await this.flowEngine.startFlow(clientId, customerPhone, 'booking', {
                    serviceId: serviceMatch.id,
                    serviceName: serviceMatch.name,
                    serviceDuration: serviceMatch.duration,
                    skipServiceQuestion: true // Flag to tell flow to skip the "What service?" question
                });
                // Re-process to let FlowEngine handle the first step
                return this.processMessage(message, customerPhone, clientId);
            }

            // 3. Fall back to intent-based responses
            const intent = this.detectIntent(message);
            console.log(`[MessageProcessor] Intent: ${intent} | Msg: ${message}`);

            const genResult = await this.generateResponse(intent, context, message);

            // Default confidence scoring logic
            let confidence = 80;
            let action: ProcessedMessage['action'] = 'reply';

            if (intent === 'unknown') {
                // If FAQ had a partial match, use it with lower confidence
                if (faqMatch && faqMatch.confidence >= 40) {
                    return {
                        response: faqMatch.answer,
                        confidence: faqMatch.confidence,
                        action: 'reply',
                        metadata: { source: 'faq_fallback' }
                    };
                }
                confidence = 0;
                action = 'escalate';
            }

            return {
                response: genResult.text,
                mediaUrls: genResult.mediaUrls,
                confidence,
                action,
                metadata: { intent }
            };

        } catch (error) {
            console.error('[MessageProcessor] Error:', error);
            return {
                response: "I'm having trouble understanding right now. An agent will be with you shortly.",
                confidence: 0,
                action: 'escalate'
            };
        }
    }

    /**
     * Detects intent from message string using regex patterns
     * Tailored for Nigerian English context
     */
    public detectIntent(message: string): string {
        const lowerMsg = message.toLowerCase();

        // Greetings
        if (/^(hi|hello|hey|good\s?morning|good\s?afternoon|good\s?evening|how\s?far|xtup|what's\s?up)/.test(lowerMsg)) {
            return 'greeting';
        }

        // Business Hours / Availability
        if (/(open|close|time|hours|available|when|weekend|sunday|saturday|working)/.test(lowerMsg) &&
            /(open|close|time|hours|when)/.test(lowerMsg)) {
            return 'hours';
        }

        // Services / Menu / Product List
        if (/(menu|list|service|product|what\s?do\s?you\s?do|catalogue|offer|sell)/.test(lowerMsg)) {
            return 'services';
        }

        // Pricing
        if (/(price|cost|how\s?much|amount|rate|fee|bill|₦)/.test(lowerMsg)) {
            return 'pricing';
        }

        // Location
        if (/(location|address|where|located|place|office|shop|na\s?where)/.test(lowerMsg)) {
            return 'location';
        }

        // Booking / Appointment
        if (/(book|appointment|schedul|reserv|slot|visit)/.test(lowerMsg)) {
            return 'booking';
        }

        // Status Check
        if (/(status|ready|done|finish|progress|far|update)/.test(lowerMsg)) {
            return 'status';
        }

        // Delivery
        if (/(deliver|send|bring|drop|shipping|dispatch)/.test(lowerMsg)) {
            return 'delivery';
        }

        // Payment
        if (/(pay|payment|money|transfer|account|bank|detail|acct)/.test(lowerMsg)) {
            return 'payment';
        }

        return 'unknown';
    }

    /**
     * Generates a text response based on intent and context
     */
    public async generateResponse(intent: string, context: MessageContext, originalMessage: string): Promise<{ text: string, mediaUrls?: string[] }> {
        // Fetch client details for context replacement
        const client = await prisma.client.findUnique({
            where: { id: context.clientId },
            select: { businessName: true, address: true, hours: true }
        });

        const businessName = client?.businessName || 'our business';

        switch (intent) {
            case 'greeting':
                return { text: templates.greeting.replace('{businessName}', businessName) };

            case 'hours':
                return { text: await this.getBusinessHours(context.clientId) };

            case 'services':
            case 'pricing':
                // Check if there is a context (Replying to Status)
                const replyMatch = originalMessage.match(/\[Replying to: "(.*?)"\]/);
                if (replyMatch && replyMatch[1]) {
                    const productName = replyMatch[1];
                    const serviceP = await this.findServiceMatch(context.clientId, productName);

                    if (serviceP) {
                        const price = `₦${Number(serviceP.price).toLocaleString()}`;
                        let text = `The price for **${serviceP.name}** is **${price}**.`;

                        // Check for Images
                        const meta = serviceP.metadata as any;
                        if (meta?.images && Array.isArray(meta.images) && meta.images.length > 0) {
                            text += `\nHere are some pictures. Would you like to order?`;
                            return { text, mediaUrls: meta.images };
                        }

                        text += `\nWould you like to book/order it?`;
                        return { text };
                    }
                }
                return { text: await this.getServiceCatalog(context.clientId) };

            case 'location':
                const address = client?.address;
                const locText = address
                    ? templates.location.replace('{address}', address).replace('{mapLink}', '')
                    : "Please contact us directly for our precise location.";
                return { text: locText };

            case 'booking':
                await this.flowEngine.startFlow(context.clientId, context.customerPhone, 'booking');
                const startRes = await this.flowEngine.handleMessage(context.clientId, context.customerPhone, originalMessage, context.customerName);
                return { text: startRes?.response || "Starting booking process..." };

            case 'status':
                await this.flowEngine.startFlow(context.clientId, context.customerPhone, 'status');
                const statusRes = await this.flowEngine.handleMessage(context.clientId, context.customerPhone, originalMessage, context.customerName);
                return { text: statusRes?.response || templates.status };

            case 'delivery':
                return { text: templates.delivery.replace('{areas}', 'your location').replace('{fee}', 'negotiable') };

            case 'payment':
                return { text: templates.payment.replace('{amount}', '0.00').replace('{paymentLink}', '#') };

            case 'unknown':
            default:
                return { text: templates.unknown };
        }
    }

    /**
     * Fetches and formats business hours
     */
    public async getBusinessHours(clientId: string): Promise<string> {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            select: { hours: true }
        });

        if (!client?.hours) {
            return "Our regular business hours are Monday to Friday, 9 AM - 5 PM.";
        }

        const formattedHours = formatHours(client.hours as Record<string, string>);
        const openStatus = getOpenStatus(client.hours as Record<string, string>);

        return templates.hours.replace('{hours}', formattedHours).replace('{openStatus}', openStatus);
    }

    /**
     * Fetches and formats active services
     */
    public async getServiceCatalog(clientId: string): Promise<string> {
        const services = await prisma.service.findMany({
            where: { clientId, isActive: true },
            take: 10,
            orderBy: { name: 'asc' }
        });

        if (services.length === 0) {
            return "We offer a variety of custom services. Please describe what you need!";
        }

        const menuItems = formatMenu(services);
        return templates.menu.replace('{menuItems}', menuItems);
    }

    private async findServiceMatch(clientId: string, text: string) {
        const services = await prisma.service.findMany({
            where: { clientId, isActive: true },
            select: { id: true, name: true, duration: true, price: true, metadata: true }
        });

        const lowerText = text.toLowerCase().trim();

        // 1. Exact Match
        const exact = services.find(s => s.name.toLowerCase() === lowerText);
        if (exact) return exact;

        // 2. Contains Match
        return services.find(s => lowerText.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerText));
    }
}
