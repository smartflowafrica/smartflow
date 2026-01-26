import { templates, formatMenu, formatHours, getOpenStatus, pickRandom } from './templates';
import { faqMatcher } from './faq-matcher';
import { FlowEngine } from './flows/engine';
import { isFuzzyMatch } from '@/lib/utils/fuzzy';
import prisma from '@/lib/prisma';

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

    private log(msg: string) {
        try {
            const fs = require('fs');
            fs.appendFileSync('processor-debug.log', `[${new Date().toISOString()}] ${msg}\n`);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Main entry point to process an incoming message
     */
    public async processMessage(
        message: string,
        customerPhone: string,
        clientId: string,
        customerName?: string
    ): Promise<ProcessedMessage> {
        try {
            const context: MessageContext = { clientId, customerPhone, customerName };

            // 0. Check for GLobal Interrupts (Reset Flow)
            // If user says "Hello", "Cancel", "Menu" - we should break out of any active flow
            const lowerMsg = message.toLowerCase();
            if (/^(hi|hello|hey|good|cancel|stop|reset|menu|start)/.test(lowerMsg)) {
                const interrupted = await this.flowEngine.interruptFlow(clientId, customerPhone);
                if (interrupted) {
                    console.log(`[MessageProcessor] Interrupted active flow via global intent`);
                }
            }

            // 1. Check for Active Flow (if not interrupted)
            const flowResult = await this.flowEngine.handleMessage(clientId, customerPhone, message, context.customerName);
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
                return this.processMessage(message, customerPhone, clientId, context.customerName);
            }

            // 2b. Check for Rating Response (1-5)
            const ratingMatch = message.trim().match(/^([1-5])(\s*stars?)?$/i);
            if (ratingMatch) {
                const rating = parseInt(ratingMatch[1]);
                const ratingResult = await this.handleRatingResponse(clientId, customerPhone, rating);
                if (ratingResult) {
                    return {
                        response: ratingResult.response,
                        confidence: 100,
                        action: 'reply',
                        metadata: { source: 'rating_handler' }
                    };
                }
            }

            // 3. Fall back to intent-based responses
            const intent = this.detectIntent(message);
            this.log(`Intent: ${intent} | Msg: ${message}`);
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
                action = 'reply'; // Send the fallback message ("I didn't catch that") instead of silence
            } else if (intent === 'help') {
                confidence = 100;
                action = 'escalate';
            }

            this.log(`Generated Response: ${genResult.text?.substring(0, 50)}...`);

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
     * Handles numeric ratings (1-5) from customers
     */
    private async handleRatingResponse(clientId: string, customerPhone: string, rating: number): Promise<{ response: string } | null> {
        try {
            // Find the most recent job where we ASKED for feedback but haven't RECEIVED it yet
            // Or just the most recent completed job if we assume they are replying to the prompt
            const job = await prisma.job.findFirst({
                where: {
                    clientId,
                    customerPhone,
                    status: 'completed',
                    feedbackRequestSent: true,
                    feedbackRating: null // Only if not yet rated
                },
                orderBy: { completedAt: 'desc' },
                include: { client: { include: { branding: true } } }
            });

            if (!job) return null; // No relevant job found, treat as normal message

            // Save Rating
            await prisma.job.update({
                where: { id: job.id },
                data: { feedbackRating: rating, feedbackNotes: 'Rated via WhatsApp' }
            });

            // Happy Path (4-5) - Unified Flow
            if (rating >= 4) {
                const discountCode = `SAVE5-${job.id.slice(-4).toUpperCase()}`;
                let response = `Thank you so much! 🌟\n\nWe are thrilled you had a great experience.\n\n🎁 **Gift for you:**\nUse code *${discountCode}* for **5% OFF** your next visit!\n\n🤝 **Share the love:**\nPlease forward our contact to friends who need reliable service. It helps us grow!`;

                // Append Google Link if available (Optional)
                // Note: Schema for Branding doesn't have googleReviewLink yet, skipping or using metadata if present
                const brandingMeta = job.client.branding as any;
                if (brandingMeta?.googleReviewLink) {
                    response += `\n\nAlso, a generic review helps a lot: ${brandingMeta.googleReviewLink}`;
                }

                return { response };

            } else {
                // Unhappy Path (1-3)
                // Escalate to Manager
                await prisma.systemLog.create({
                    data: {
                        clientId,
                        level: 'WARNING',
                        message: `Negative Feedback (${rating}/5) from ${job.customerName}`,
                        metadata: { jobId: job.id, phone: customerPhone, rating }
                    }
                });

                // Notify Admin (Future: Send WhatsApp to Admin)

                return {
                    response: `I am incredibly sorry to hear that. 😔\n\nYour feedback (${rating}/5) has been flagged to our Manager immediately.\n\nactive support agent will contact you shortly to make things right.`
                };
            }

        } catch (error) {
            console.error('Error handling rating:', error);
            return null;
        }
    }

    /**
     * Detects intent from message string using fuzzy matching (typo tolerance)
     * Tailored for Nigerian English context
     */
    public detectIntent(message: string): string {
        const msg = message.toLowerCase();

        // 1. Greetings
        if (isFuzzyMatch(msg, ['hello', 'hi', 'hey', 'start', 'good morning', 'good afternoon', 'how far', 'wetin dey', 'xup'], 0.85)) {
            return 'greeting';
        }

        // 2. Business Hours
        if (isFuzzyMatch(msg, ['open', 'close', 'time', 'hour', 'available', 'working', 'weekend'], 0.8)) {
            return 'hours';
        }

        // 3. Pricing (Priority over Services if ambiguous)
        if (isFuzzyMatch(msg, ['price', 'cost', 'how much', 'amount', 'rate', 'fee', 'bill', 'pay'], 0.8)) {
            return 'pricing';
        }

        // 4. Services / Menu
        if (isFuzzyMatch(msg, ['menu', 'list', 'service', 'product', 'catalog', 'offer', 'sell', 'buy'], 0.8)) {
            return 'services';
        }

        // 5. Location
        if (isFuzzyMatch(msg, ['location', 'address', 'where', 'located', 'office', 'shop', 'place'], 0.8)) {
            return 'location';
        }

        // 6. Booking
        if (isFuzzyMatch(msg, ['book', 'appointment', 'schedule', 'reserve', 'slot', 'visit', 'date'], 0.8)) {
            return 'booking';
        }

        // 7. Status
        if (isFuzzyMatch(msg, ['status', 'ready', 'done', 'finish', 'progress', 'far'], 0.85)) {
            return 'status';
        }

        // 7.5 Inspection (Specific)
        if (isFuzzyMatch(msg, ['inspection', 'inspect', 'check car', 'assess car'], 0.8)) {
            return 'inspection';
        }

        // 8. Delivery
        if (isFuzzyMatch(msg, ['deliver', 'send', 'bring', 'shipping', 'dispatch'], 0.85)) {
            return 'delivery';
        }

        // 9. Payment Intent (Specific)
        if (isFuzzyMatch(msg, ['account', 'bank', 'transfer', 'details'], 0.85)) {
            return 'payment';
        }

        // 10. Help / Confusion / Escalate
        // "I don't understand", "speak to human", "customer care", "help"
        if (isFuzzyMatch(msg, ['understand', 'confused', 'human', 'agent', 'person', 'support', 'help', 'care', 'error', 'mistake', 'talk'], 0.8)) {
            return 'help';
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
                const greeting = pickRandom(templates.greeting).replace('{businessName}', businessName);
                const menu = await this.getServiceCatalog(context.clientId);
                return { text: `${greeting}\n\n${menu}` };

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
                        let text = pickRandom(templates.price)
                            .replace('{serviceName}', serviceP.name)
                            .replace('{price}', price);

                        // Check for Images
                        const meta = serviceP.metadata as any;
                        if (meta?.images && Array.isArray(meta.images) && meta.images.length > 0) {
                            text += `\nHere are some pictures. Would you like to order?`;
                            return { text, mediaUrls: meta.images };
                        }

                        // text += `\nWould you like to book/order it?`;
                        return { text };
                    }
                }
                return { text: await this.getServiceCatalog(context.clientId) };

            case 'location':
                const address = client?.address;
                const locText = address
                    ? pickRandom(templates.location).replace('{address}', address).replace('{mapLink}', '')
                    : "Please contact us directly for our precise location.";
                return { text: locText };

            case 'booking':
                await this.flowEngine.startFlow(context.clientId, context.customerPhone, 'booking');
                const startRes = await this.flowEngine.handleMessage(context.clientId, context.customerPhone, originalMessage, context.customerName);
                return { text: startRes?.response || "Starting booking process..." };

            case 'status':
                await this.flowEngine.startFlow(context.clientId, context.customerPhone, 'status');
                const statusRes = await this.flowEngine.handleMessage(context.clientId, context.customerPhone, originalMessage, context.customerName);
                return { text: statusRes?.response || pickRandom(templates.status) };

            case 'inspection':
                await this.flowEngine.startFlow(context.clientId, context.customerPhone, 'inspection');
                const inspRes = await this.flowEngine.handleMessage(context.clientId, context.customerPhone, originalMessage, context.customerName);
                return { text: inspRes?.response || "Starting inspection booking..." };

            case 'delivery':
                return { text: pickRandom(templates.delivery).replace('{areas}', 'your location').replace('{fee}', 'negotiable') };

            case 'payment':
                return { text: pickRandom(templates.payment).replace('{amount}', '0.00').replace('{paymentLink}', '#') };

            case 'help':
                // Explicit escalation (handled by main loop via confidence 100 + action='escalate' if detected as 'help' intent)
                // But since we are inside generateResponse which returns text...
                return {
                    text: "I understand you need assistance. I'm connecting you with a human agent now. Please hold on.",
                };

            case 'unknown':
            default:
                return { text: pickRandom(templates.unknown) };
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

        return pickRandom(templates.hours).replace('{hours}', formattedHours).replace('{openStatus}', openStatus);
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
        return pickRandom(templates.menu).replace('{menuItems}', menuItems);
    }

    private async findServiceMatch(clientId: string, text: string) {
        try {
            const services = await prisma.service.findMany({
                where: { clientId, isActive: true },
                select: { id: true, name: true, duration: true, price: true, metadata: true }
            });

            const lowerText = text.toLowerCase().trim();

            // 1. Exact Match
            const exact = services.find(s => s.name.toLowerCase() === lowerText);
            if (exact) return exact;

            // 2. Numeric Match (1, 2, 3...)
            if (/^\d+$/.test(lowerText)) {
                const index = parseInt(lowerText) - 1;

                // Re-fetch sorted to match menu order
                const sortedServices = await prisma.service.findMany({
                    where: { clientId, isActive: true },
                    orderBy: { name: 'asc' },
                    take: 10
                });

                if (index >= 0 && index < sortedServices.length) {
                    return sortedServices[index];
                }
            }

            // 3. Contains Match
            const containsMatch = services.find(s => lowerText.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerText));
            if (containsMatch) return containsMatch;

            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
