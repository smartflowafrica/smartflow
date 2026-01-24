
import Redis from 'ioredis';
import prisma from '@/lib/prisma';

// Interface matching the User's request + Existing usage
interface SendMessageParams {
    to: string;       // phone number
    body: string;     // content
    files?: string[];
}

export class WhatsAppService {
    private redis: Redis;
    private apiUrl: string;
    private apiKey: string;
    private instanceName: string;

    constructor() {
        this.apiUrl = process.env.SERVER_URL || 'http://localhost:8081';
        this.apiKey = process.env.AUTHENTICATION_API_KEY || '';
        this.instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'SmartFlowMain';

        // Initialize Redis for Rate Limiting
        this.redis = new Redis(process.env.CACHE_REDIS_URI || 'redis://localhost:6379/1');
    }

    /**
     * Formats a phone number to standard format (remove +, spaces)
     * Evolution API usually takes numbers with country code but NO +
     */
    public formatPhone(phone: string): string {
        let clean = phone.replace(/\D/g, ''); // Remove all non-digits
        // Nigerian handling (080 -> 23480)
        if (clean.startsWith('0') && clean.length === 11) {
            clean = '234' + clean.substring(1);
        }
        return clean;
    }

    /**
     * Sends a WhatsApp message via Evolution API with Safety Layers
     */
    public async sendMessage(to: string, message: string, clientId?: string): Promise<any> {
        const formattedTo = this.formatPhone(to);

        // 1. SAFETY: Rate Limiting Check
        await this.checkRateLimit(formattedTo);

        try {
            // 2. Send via Evolution API (v1.8 format)
            const response = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.apiKey
                },
                body: JSON.stringify({
                    number: formattedTo,
                    textMessage: {
                        text: message
                    },
                    options: {
                        delay: 1200 // Add slight delay for safety
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Evolution API Error');
            }

            const data = await response.json();

            // 3. Log to Database (if clientId provided)
            if (clientId) {
                await prisma.message.create({
                    data: {
                        clientId,
                        customerPhone: to,
                        messageText: message,
                        handledBy: 'BOT',
                        status: 'COMPLETED',
                        category: 'notification'
                    }
                });
            }

            return { success: true, data };

        } catch (error: any) {
            console.error('Evolution Send Error:', error);
            if (clientId) {
                await prisma.message.create({
                    data: {
                        clientId,
                        customerPhone: to,
                        messageText: message,
                        handledBy: 'BOT',
                        status: 'FAILED',
                        category: 'notification',
                        metadata: { error: error.message }
                    }
                });
            }
            throw error;
        }
    }

    /**
     * SAFETY LAYER: Rate Limits
     * Max 20 messages per hour per recipient
     */
    private async checkRateLimit(recipient: string): Promise<void> {
        const key = `ratelimit:${recipient}`;
        const limit = 20;
        const window = 3600; // 1 hour

        const current = await this.redis.incr(key);

        if (current === 1) {
            await this.redis.expire(key, window);
        }

        if (current > limit) {
            throw new Error(`Rate limit exceeded for ${recipient}. Try again later.`);
        }
    }

    /**
     * Validates Webhook Request (Simple API Check for now)
     * Evolution doesn't strict sign like Twilio by default unless configured
     */
    public validateRequest(url: string, body: any, signature: string): boolean {
        // In real Evolution setup, verify secret token matching webhook config
        // For now, assume true or check a custom header if we set one up
        return true;
    }

    /**
     * Handles incoming Evolution Webhook payload
     * Adapts Evolution structure to our App's normalized structure
     */
    public async handleIncomingWebhook(body: any) {
        // Evolution payload structure (v1.8+ observed form logs)
        // { 
        //   event: "messages.upsert",
        //   instance: "SmartFlowMain", 
        //   data: { key: { remoteJid: "..." }, message: { conversation: "..." }, pushName: "..." } 
        // }

        try {
            const eventType = body.event || body.type; // 'messages.upsert' or 'MESSAGES_UPSERT'

            // Ensure we are handling a message event
            if (!eventType || !eventType.toLowerCase().includes('message')) {
                return null; // Ignore other events
            }

            const msgData = body.data;
            if (!msgData || !msgData.key || msgData.key.fromMe) {
                // Ignore messages sent by ME (outbound)
                return null;
            }

            const rawFrom = msgData.key.remoteJid; // e.g., 2348012345678@s.whatsapp.net
            const cleanFrom = rawFrom.split('@')[0]; // 2348012345678

            // Extract text message (handle conversation vs extendedTextMessage)
            let messageBody = '';
            let contextText = '';

            // Handle Text / Reply
            if (msgData.message?.conversation) {
                messageBody = msgData.message.conversation;
            } else if (msgData.message?.extendedTextMessage) {
                messageBody = msgData.message.extendedTextMessage.text || '';

                // Check for Quoted Context (Status Reply or Reply to Message)
                const contextInfo = msgData.message.extendedTextMessage.contextInfo;
                if (contextInfo && contextInfo.quotedMessage) {
                    const quoted = contextInfo.quotedMessage;
                    // Try to get text from various quoted types
                    const quotedText = quoted.conversation ||
                        quoted.extendedTextMessage?.text ||
                        quoted.imageMessage?.caption ||
                        quoted.videoMessage?.caption ||
                        'Media';

                    if (quotedText) {
                        contextText = ` [Replying to: "${quotedText.substring(0, 50)}..."]`;
                    }
                }
            } else if (msgData.message?.imageMessage?.caption) {
                messageBody = msgData.message.imageMessage.caption;
            }

            if (messageBody && contextText) {
                messageBody += contextText;
            }

            if (!messageBody) return null; // Ignore status updates or empty msgs

            const profileName = msgData.pushName || 'Unknown';
            const messageSid = msgData.key.id;

            // Our Logic expects format: { from, to, message, name, sid }
            // 'to' is basically us (the instance number). We might not get it easily in payload depending on config.
            // We'll use a placeholder or env for 'to' if needed, or extract from `msgData.key.remoteJid` if it was a group (unsupported now)
            // For 1:1, 'to' is the Instance Owner.
            // Let's assume 'to' is our configured number
            const myNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'self';

            console.log(`[Evolution Parsed] From: ${cleanFrom} | Msg: ${messageBody}`);

            return {
                from: '+' + cleanFrom, // Normalize to +Format for our DB consistency
                to: myNumber,
                message: messageBody,
                name: profileName,
                sid: messageSid,
                raw: body
            };

        } catch (error: any) {
            console.error('Webhook Parse Error:', error);
            throw error;
        }
    }

    /**
     * Sends Media Message (Image) via Evolution API
     */
    public async sendMedia(to: string, mediaUrl: string, caption?: string, clientId?: string): Promise<any> {
        const formattedTo = this.formatPhone(to);
        await this.checkRateLimit(formattedTo);

        try {
            const response = await fetch(`${this.apiUrl}/message/sendMedia/${this.instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.apiKey
                },
                body: JSON.stringify({
                    number: formattedTo,
                    mediaMessage: {
                        mediatype: 'image',
                        media: mediaUrl,
                        caption: caption || ''
                    },
                    options: { delay: 1200 }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Evolution Media API Error');
            }

            const data = await response.json();

            if (clientId) {
                await prisma.message.create({
                    data: {
                        clientId,
                        customerPhone: to,
                        messageText: `[Image] ${caption || ''}`,
                        handledBy: 'BOT',
                        status: 'COMPLETED',
                        category: 'notification'
                    }
                });
            }

            return { success: true, data };

        } catch (error: any) {
            console.error('Evolution Media Send Error:', error);
            throw error;
        }
    }

    /**
     * Posts a media update to WhatsApp Status (Stories)
     */
    public async postStatus(mediaUrl: string, caption?: string, clientId?: string): Promise<any> {
        // Evolution/Baileys uses 'status@broadcast' JID for status updates
        const statusJid = 'status@broadcast';

        try {
            // FALLBACK: Use sendText because sendMedia (Status) is returning 500 Error
            // We concatenate caption + mediaUrl (if it's a link) or just Caption
            const textContent = `${caption || ''}`;

            console.warn('[WhatsAppService] postStatus: Media Status disabled due to API limits. Sending Text Status.');

            const response = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.apiKey
                },
                body: JSON.stringify({
                    number: statusJid,
                    options: { delay: 1200 },
                    textMessage: {
                        text: textContent
                    }
                })
            });

            if (!response.ok) {
                // don't throw immediately, just log, as status posting failure shouldn't block service creation
                console.error('Status Post Failed:', await response.text());
                return { success: false };
            }

            if (clientId) {
                // Log action? Maybe not as a 'message' to a customer, but an activity log.
                // For now just console log.
                console.log(`[Status Posted] Client ${clientId} posted to status.`);
            }

            return { success: true };

        } catch (error: any) {
            console.error('Evolution Status Error:', error);
            return { success: false, error: error.message };
        }
    }
}
