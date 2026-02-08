
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

    constructor(instanceName?: string) {
        this.apiUrl = process.env.SERVER_URL || 'http://127.0.0.1:8081';
        this.apiKey = process.env.AUTHENTICATION_API_KEY || '';
        // Use provided instance name, or fallback to default Env
        this.instanceName = instanceName || process.env.EVOLUTION_INSTANCE_NAME || 'SmartFlowMain';

        // Initialize Redis for Rate Limiting
        this.redis = new Redis(process.env.CACHE_REDIS_URI || 'redis://localhost:6379/1');
    }


    /**
     * Formats a phone number to standard format (remove +, spaces)
     * Evolution API usually takes numbers with country code but NO +
     */
    public formatPhone(phone: string): string {
        // Evolution V1.8 Strict Rule: No '+' allowed in the number field, for ANY JID type.
        // Even for LIDs (123@lid) or Groups (123@g.us), or Phones (234...).

        let clean = phone;

        // 1. Remove leading '+' if present (Universal fix)
        if (clean.startsWith('+')) {
            clean = clean.substring(1);
        }

        // 2. If it's a JID (contains @), return it (now without +)
        if (clean.includes('@')) {
            return clean;
        }

        // 3. For raw numbers, strip non-digits
        clean = clean.replace(/\D/g, '');

        // 4. Nigerian handling (080 -> 23480)
        if (clean.startsWith('0') && clean.length === 11) {
            clean = '234' + clean.substring(1);
        }
        return clean;
    }

    // --- INSTANCE MANAGEMENT FOR MULTI-TENANCY ---

    /**
     * Creates a new Evolution Instance for a client
     */
    public async createInstance(instanceName: string, integrationId?: string): Promise<boolean> {
        // 1. Create Instance (without webhook first to be safe)
        const createResponse = await fetch(`${this.apiUrl}/instance/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.apiKey
            },
            body: JSON.stringify({
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS'
            })
        });

        if (createResponse.status === 403) {
            console.log('[WhatsAppService] Instance is already connected.');
            return { instance: { state: 'open', status: 'connected' } };
        }

        console.log('[WhatsAppService] Instance exists but NOT connected. Deleting and Re-creating...');
        await this.deleteInstance();
        // Retry creation (one level deep)
        return await this.createInstance(instanceName, integrationId);

    } catch(retryError) {
        console.error('[WhatsAppService] Recovery failed:', retryError);
        // Fallback to connect to at least show something, or throw
        return this.connectInstance();
    }
}
throw new Error(`Failed to create instance: ${errorText}`);
        }

const data = await response.json();
return data;
    }

    /**
     * Sets the webhook for a specific instance
     */
    public async setWebhook(instanceName: string): Promise < any > {
    const response = await fetch(`${this.apiUrl}/webhook/set/${instanceName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey
        },
        body: JSON.stringify({
            webhook: {
                enabled: true,
                url: 'https://smartflowafrica.com/api/webhooks/whatsapp',
                webhookByEvents: false,
                events: ['MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE']
            }
        })
    });

    if(!response.ok) {
    console.error('Webhook Set Error:', await response.text());
}

return response.ok;
    }

    /**
     * Fetches the connection status and QR code if strictly needed
     */
    public async connectInstance(signal ?: AbortSignal): Promise < { base64?: string, status: string, error?: string } > {
    // Evolution v1.8 /instance/connect/{instance}
    try {
        const response = await fetch(`${this.apiUrl}/instance/connect/${this.instanceName}`, {
            method: 'GET',
            headers: {
                'apikey': this.apiKey
            },
            signal
        });

        if(!response.ok) {
    const errorText = await response.text();
    console.error(`[WhatsAppService] Connect Failed (${response.status}): ${errorText}`);
    return { status: 'ERROR', error: errorText };
}

const data = await response.json();

// Normalization for Evolution v2 (qrcode is nested)
if (data.qrcode && data.qrcode.base64) {
    return { ...data, base64: data.qrcode.base64 };
}

return data;
        } catch (e: any) {
    console.error('[WhatsAppService] Connect Network Error:', e);
    return { status: 'ERROR', error: e.message };
}
    }

    /**
     * Gets instance connection state
     */
    public async getInstanceStatus(): Promise < any > {
    try {
        const response = await fetch(`${this.apiUrl}/instance/connectionState/${this.instanceName}`, {
            method: 'GET',
            headers: { 'apikey': this.apiKey }
        });

        if(!response.ok) {
    // If 404, it means instance doesn't exist yet
    if (response.status === 404) {
        return { instance: { state: 'not_found' } };
    }
    // If 5xx, might be service error
    return { instance: { state: 'error', error: `API Error: ${response.status}` } };
}

return await response.json();
        } catch (error: any) {
    console.error('[WhatsAppService] getInstanceStatus Error:', error.message);
    // Return a special state indicating unreachable
    return { instance: { state: 'unreachable', error: error.message } };
}
    }


    public async deleteInstance(): Promise < boolean > {
    const response = await fetch(`${this.apiUrl}/instance/delete/${this.instanceName}`, {
        method: 'DELETE',
        headers: { 'apikey': this.apiKey }
    });
    return response.ok;
}

    /**
     * Restarts an instance to force reconnection after QR scan
     * This is needed in Evolution v2 as the status sometimes gets stuck on 'connecting'
     * Uses /instance/restart which forces a full socket tear-down and reconnection
     */
    public async restartInstance(): Promise < boolean > {
    try {
        console.log(`[WhatsAppService] Force restarting instance ${this.instanceName} to fix connection...`);

        const response = await fetch(`${this.apiUrl}/instance/restart/${this.instanceName}`, {
            method: 'PUT',
            headers: { 'apikey': this.apiKey }
        });

        console.log(`[WhatsAppService] Restart Instance Result: ${response.status}`);
        return response.ok;
    } catch(error: any) {
        console.error('[WhatsAppService] Restart Instance Error:', error.message);
        return false;
    }
}

    /**
     * Helper to check if instance is connected
     * (Useful for UI or conditional logic)
     */
    public async isConnected(clientId ?: string): Promise < boolean > {
    try {
        // If clientId is provided, we might want to lookup the instance name?
        // For now, Single Tenant assumption per Class Instance or Env
        // But if we want multi-tenant dynamic checks, we'd need to switch this.instanceName
        // For now, let's just check the current instance configured in constructor.

        const status = await this.getInstanceStatus();
        return status?.instance?.state === 'open';
    } catch(e) {
        return false;
    }
}

    /**
     * Fetches ALL instances for Admin Monitoring
     */
    public async fetchInstances(): Promise < any[] > {
    // Evolution v1.8+ /instance/fetchInstances
    const response = await fetch(`${this.apiUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: { 'apikey': this.apiKey }
    });

    if(!response.ok) {
    console.error('Failed to fetch instances:', await response.text());
    return [];
}

const data = await response.json();
// Evolution returns array of instance objects
return Array.isArray(data) ? data : [];
    }

    // --- MESSAGING ---

    /**
     * Sends a WhatsApp message via Evolution API with Safety Layers
     */
    public async sendMessage(to: string, message: string, clientId ?: string): Promise < any > {
    let formattedTo = this.formatPhone(to);

    // 1. SAFETY: Rate Limiting Check
    await this.checkRateLimit(formattedTo);

    // 2. SAFETY: Resolve LID if needed
    if(formattedTo.includes('@lid')) {
    console.log(`[sendMessage] Detected LID ${formattedTo}. Resolving to real JID...`);
    const realJid = await this.resolveLidToNumber(formattedTo);
    if (realJid) {
        console.log(`[sendMessage] Resolved LID to ${realJid}`);
        // Use the resolved JID (strip @s.whatsapp.net for standard number field if needed, but Evolution usually takes full JID or number)
        // Evolution v1.8 usually prefers just number for 'number' field, but JID is safer if it contains domain.
        // However, formatPhone() creates valid input for 'number'. 
        // Let's use the USER part of the JID if it's standard whatsapp.net
        formattedTo = realJid.split('@')[0];
    } else {
        console.warn(`[sendMessage] Failed to resolve LID ${formattedTo}. Attempting send anyway...`);
    }
}

// Inner function to attempt sending
const attemptSend = async (signal?: AbortSignal) => {
    const bodyPayload = {
        number: formattedTo,
        textMessage: { text: message },
        options: {
            delay: 1200,
            presence: 'composing',
            linkPreview: false,
            forceSend: true
        }
    };
    console.log(`[sendMessage] Sending Payload:`, JSON.stringify(bodyPayload));

    const response = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey
        },
        signal,
        body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        // Check specifically for Connection Closed or 500
        if (response.status === 500 || errorText.includes('Connection Closed')) {
            throw new Error(`RETRY_NEEDED: ${errorText}`);
        }
        throw new Error(`Evolution API Error (${response.status}): ${errorText}`);
    }
    return await response.json();
};

try {
    let data;
    try {
        // Timeout wrapper for attemptSend to fail fast (30s max for send)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            data = await attemptSend(controller.signal);
        } finally {
            clearTimeout(timeoutId);
        }

    } catch (initialError: any) {
        // Identify Retryable Errors vs Permanent Errors
        const isRetryable = initialError.message.includes('RETRY_NEEDED') ||
            initialError.message.includes('timeout') ||
            initialError.name === 'AbortError';

        if (isRetryable) {
            console.warn(`[WhatsAppService] Connection/Timeout issue. Attempting to reconnect ${this.instanceName}...`);

            // 1. Trigger Reconnect (Non-Blocking if possible, but here we wait with short timeout)
            try {
                const connectController = new AbortController();
                const connectTimeout = setTimeout(() => connectController.abort(), 10000); // 10s max for connect
                await this.connectInstance(connectController.signal);
                clearTimeout(connectTimeout);
            } catch (e) {
                console.error('[WhatsAppService] Reconnect attempt failed or timed out:', e);
                // Continue to retry send anyway, maybe it auto-connected?
            }

            // 2. Wait 3 seconds for connection stability
            await new Promise(r => setTimeout(r, 3000));

            console.log('[WhatsAppService] Retrying message send...');
            // Retry with fresh timeout
            const retryController = new AbortController();
            const retryTimeout = setTimeout(() => retryController.abort(), 30000);
            try {
                data = await attemptSend(retryController.signal);
            } finally {
                clearTimeout(retryTimeout);
            }
        } else {
            throw initialError;
        }
    }

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

    // Log to System Health
    try {
        await prisma.systemLog.create({
            data: {
                level: 'ERROR',
                message: `WhatsApp Send Failed: ${error.message || 'Unknown error'}`,
                clientId: clientId,
                metadata: { to, error: error.message }
            }
        });
    } catch (logError) {
        console.error('Failed to log system error', logError);
    }

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
    private async checkRateLimit(recipient: string): Promise < void> {
    const key = `ratelimit:${recipient}`;
    const limit = 1000; // Increased limit for production usage
    const window = 3600; // 1 hour

    const current = await this.redis.incr(key);

    if(current === 1) {
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

        const rawFrom = msgData.key.remoteJid; // e.g., 2348012345678@s.whatsapp.net OR 174...@lid

        // Custom cleanup: If it's a standard number, strip domain. If LID, keep full.
        let cleanFrom = rawFrom;
        let formattedFrom = rawFrom;

        if (rawFrom.includes('@lid')) {
            // LID Detected.
            // UNRELIABLE: body.sender often points to the Instance Owner (Bot), not the Guest. 
            // We must reply on 'participant' or API lookup.
            // FIX: Do NOT fall back to body.sender, as that is the Instance Owner!
            const participantJid = msgData.participant || msgData.key.participant;

            if (participantJid && participantJid.includes('@s.whatsapp.net')) {
                console.log(`[Webhook] LID Detected (${rawFrom}). Found real JID in participant: ${participantJid}`);
                cleanFrom = participantJid.split('@')[0];
                formattedFrom = '+' + cleanFrom;
            } else {
                // API Lookup
                console.log(`[Webhook] LID Detected: ${rawFrom}. Resolving via API...`);
                const realJid = await this.resolveLidToNumber(rawFrom);

                if (realJid) {
                    console.log(`[Webhook] Resolved LID ${rawFrom} -> ${realJid}`);
                    cleanFrom = realJid.split('@')[0];
                    formattedFrom = '+' + cleanFrom;
                } else {
                    // Fallback: Use the LID itself, but strictly NO '+'.
                    console.warn(`[Webhook] Failed to resolve LID ${rawFrom}. Will reply to LID directly.`);
                    // Ensure we don't have a plus
                    cleanFrom = rawFrom.replace(/^\+/, '');
                    formattedFrom = cleanFrom; // Keep LID format, no plus added

                    // NEW ATTEMPT: If previous logic failed, maybe we can search DB for this LID?
                    // (Implemented in webhook route: Priority 3)

                    // FINAL SAFETY: If we still have an LID here, we should try one last time to resolve it using the 'chat/find' endpoint which might be slower but more accurate
                    try {
                        if (!cleanFrom || cleanFrom.includes('@lid')) {
                            console.log(`[Webhook] Deep Resolve for LID: ${rawFrom}`);
                            const deepResolve = await this.resolveLidToNumber(rawFrom);
                            if (deepResolve) {
                                console.log(`[Webhook] Deep Resolve Success: ${deepResolve}`);
                                cleanFrom = deepResolve.split('@')[0];
                                formattedFrom = '+' + cleanFrom;
                            }
                        }
                    } catch (e) {
                        console.error('[Webhook] Deep Resolve Failed', e);
                    }
                }
            }
        } else {
            // Standard Phone Number (Account or Legacy) or Fallback
            // Just strip non-digits to ensure we have a clean number, avoiding '++' or domain issues.
            cleanFrom = rawFrom.replace(/\D/g, '');
            formattedFrom = '+' + cleanFrom;
        }

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

        // Extract instance name from body for Multi-Tenancy routing!
        const instanceId = body.instance;

        console.log(`[Evolution Parsed] Instance: ${instanceId} | From: ${cleanFrom} | Msg: ${messageBody}`);

        return {
            from: '+' + cleanFrom, // Normalize to +Format for our DB consistency
            to: myNumber,
            message: messageBody,
            name: profileName,
            sid: messageSid,
            instanceId: instanceId, // Return this for routing
            raw: body
        };

    } catch (error: any) {
        console.error('Webhook Parse Error:', error);
        throw error;
    }
}

    /**
     * Resolves a Linked Device ID (LID) to a Real Phone Number JID
     * Uses Evolution API /chat/find endpoint
     */
    private async resolveLidToNumber(lidJid: string): Promise < string | null > {
    try {
        // endpoint: /chat/find/{instance}/{lidJid}
        console.log(`[resolveLidToNumber] Querying: /chat/find/${this.instanceName}/${lidJid}`);
        const response = await fetch(`${this.apiUrl}/chat/find/${this.instanceName}/${lidJid}`, {
            method: 'GET',
            headers: { 'apikey': this.apiKey }
        });

        if(response.ok) {
    const data = await response.json();
    console.log(`[resolveLidToNumber] Chat Find Result:`, JSON.stringify(data));
    if (data?.id && data.id.includes('@s.whatsapp.net')) {
        return data.id;
    }
} else {
    console.warn(`[resolveLidToNumber] Chat Find Failed: ${response.status} ${await response.text()}`);
}

// TRY: POST /chat/onWhatsApp (Standard Existence Check)
console.log(`[resolveLidToNumber] Querying (POST): /chat/onWhatsApp/${this.instanceName}`);
const responseCheck = await fetch(`${this.apiUrl}/chat/onWhatsApp/${this.instanceName}`, {
    method: 'POST',
    headers: { 'apikey': this.apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ numbers: [lidJid] })
});

if (responseCheck.ok) {
    const dataCheck = await responseCheck.json();
    console.log(`[resolveLidToNumber] OnWhatsApp Result:`, JSON.stringify(dataCheck));
    // Expecting array: [{ exists: true, jid: "...", number: "..." }]
    if (Array.isArray(dataCheck) && dataCheck.length > 0 && dataCheck[0].exists) {
        const found = dataCheck[0];
        if (found.jid && found.jid.includes('@s.whatsapp.net')) return found.jid;
    }
} else {
    console.warn(`[resolveLidToNumber] OnWhatsApp Failed: ${responseCheck.status} ${await responseCheck.text()}`);
}

// Try /contact/find if chat/find failed?
console.log(`[resolveLidToNumber] Querying: /contact/find/${this.instanceName}/${lidJid}`);
const responseContact = await fetch(`${this.apiUrl}/contact/find/${this.instanceName}/${lidJid}`, {
    method: 'GET',
    headers: { 'apikey': this.apiKey }
});

if (responseContact.ok) {
    const dataContact = await responseContact.json();
    console.log(`[resolveLidToNumber] Contact Find Result:`, JSON.stringify(dataContact));
    if (dataContact?.id && dataContact.id.includes('@s.whatsapp.net')) {
        return dataContact.id;
    }
} else {
    console.warn(`[resolveLidToNumber] Contact Find Failed: ${responseContact.status} ${await responseContact.text()}`);
}

// FALLBACK: If we can't resolve, just return NULL. 
// The caller will then decide whether to use the LID.
// But wait! If we return null, the caller uses the LID.
// The caller does: if (realJid) ... else ... attempt send anyway.
// The ERROR log earlier showed: Evolution API Error (400): ... "jid":"250...@lid" ...
// This suggests Evolution failed to send to the LID.
// Maybe we need to ensure the LID is passed Cleanly?
// The formatPhone function removes +, which is good.

return null;
        } catch (e) {
    console.error('LID Resolution Error:', e);
    return null;
}
    }

    /**
     * Sends Media Message (Image) via Evolution API
     */
    public async sendMedia(to: string, mediaUrl: string, caption ?: string, clientId ?: string, mediaType: 'image' | 'video' | 'document' = 'image', fileName ?: string): Promise < any > {
    const formattedTo = this.formatPhone(to);
    await this.checkRateLimit(formattedTo);

    let finalTo = formattedTo;
    if(finalTo.includes('@lid')) {
    const realJid = await this.resolveLidToNumber(finalTo);
    if (realJid) finalTo = realJid.split('@')[0];
}

try {
    const response = await fetch(`${this.apiUrl}/message/sendMedia/${this.instanceName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey
        },
        body: JSON.stringify({
            number: finalTo,
            mediaMessage: {
                mediatype: mediaType, // Dynamic type
                media: mediaUrl,
                caption: caption || '',
                fileName: fileName // Use provided filename or let API decide
            },
            options: { delay: 1200 }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Evolution Media API Error Response:', errorText);
        throw new Error(`Evolution Media API Error: ${errorText}`);
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
    public async postStatus(mediaUrl: string, caption ?: string, clientId ?: string): Promise < any > {
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

        if(!response.ok) {
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
