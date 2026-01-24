
import crypto from 'crypto';

// --- Interfaces ---

export interface PaystackInitializeParams {
    email: string;
    amount: number; // In Kobo (e.g., N100 = 10000)
    reference?: string;
    callback_url?: string;
    plan?: string; // Plan code for subscriptions (e.g., PLN_xxx)
    metadata?: Record<string, any>;
    currency?: string; // Defaults to NGN
    channels?: string[]; // ['card', 'bank'] etc.
}

export interface PaystackInitializeResponse {
    authorization_url: string;
    access_code: string;
    reference: string;
}

export interface PaystackVerifyResponse {
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    paid_at: string; // ISO Date
    channel: string;
    currency: string;
    metadata?: any;
    customer: {
        email: string;
        customer_code: string;
    };
    plan?: string; // If subscription
    authorization: {
        authorization_code: string;
        card_type: string;
        last4: string;
        exp_month: string;
        exp_year: string;
        bin: string;
        bank: string;
        channel: string;
        signature: string;
        reusable: boolean;
    };
}

export interface PaystackPlanParams {
    name: string;
    amount: number; // in Kobo
    interval: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    description?: string;
    currency?: string;
    invoice_limit?: number; // Number of times to charge
}

export interface PaystackInvoiceParams {
    customer: string; // Customer code or email
    amount: number; // in Kobo
    due_date?: string; // ISO
    description?: string;
    line_items?: Array<{
        name: string;
        amount: number;
        quantity: number;
    }>;
}

export interface WebhookEvent {
    event: string;
    data: any;
}

// --- Error Class ---

export class PaystackError extends Error {
    constructor(public message: string, public statusCode?: number, public body?: any) {
        super(message);
        this.name = 'PaystackError';
    }
}

// --- Service Class ---

export class PaystackService {
    private readonly secretKey: string;
    private readonly baseUrl: string = 'https://api.paystack.co';

    constructor() {
        // We read inside constructor to ensure process.env is loaded
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key) {
            console.warn('PAYSTACK_SECRET_KEY is not set. Paystack calls will fail.');
        }
        this.secretKey = key || '';
    }

    /**
     * Helper: Convert Naira to Kobo
     */
    public static toKobo(naira: number): number {
        return Math.round(naira * 100);
    }

    /**
     * Helper: Make API requests
     */
    private async request<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT', body?: any): Promise<T> {
        if (!this.secretKey) {
            throw new PaystackError('Missing Paystack Secret Key');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };

        try {
            const res = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                cache: 'no-store', // Ensure no caching for payments
            });

            const json = await res.json();

            if (!res.ok || !json.status) {
                throw new PaystackError(
                    json.message || `Paystack API Error: ${res.statusText}`,
                    res.status,
                    json
                );
            }

            return json.data as T;
        } catch (error: any) {
            if (error instanceof PaystackError) throw error;
            throw new PaystackError(error.message || 'Network Error');
        }
    }

    /**
     * 1. Initialize Transaction (Charge or Subscribe)
     */
    async initializeTransaction(params: PaystackInitializeParams): Promise<PaystackInitializeResponse> {
        // Ensure amount is integer
        const payload = { ...params, amount: Math.round(params.amount) };
        return this.request<PaystackInitializeResponse>('/transaction/initialize', 'POST', payload);
    }

    /**
     * 2. Verify Payment with Retry Logic
     * Because webhooks can delay or network can blip, we sometimes poll verify.
     */
    async verifyPayment(reference: string, retries = 3): Promise<PaystackVerifyResponse> {
        let attempt = 0;

        while (attempt < retries) {
            try {
                const data = await this.request<PaystackVerifyResponse>(`/transaction/verify/${reference}`, 'GET');

                // If the status is 'abandoned' or 'failed', we might not want to retry, just return it.
                // But if the request itself failed (network), the catch block handles retry.
                // Assuming the API call succeeded:
                return data;

            } catch (error) {
                attempt++;
                // If it's a 404 (transaction not found yet?), we might retry.
                // If it's 401 (auth), don't retry.
                const isRetryable = error instanceof PaystackError && (!error.statusCode || error.statusCode >= 500 || error.statusCode === 404);

                if (attempt >= retries || !isRetryable) {
                    throw error;
                }

                // Exponential Backoff: 1s, 2s, 4s...
                const delay = 1000 * Math.pow(2, attempt - 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }

        throw new PaystackError('Transaction verification failed after retries');
    }

    /**
     * 3. Create Plan (For Recurring Subscriptions)
     */
    async createPlan(params: PaystackPlanParams): Promise<{ id: number; plan_code: string; name: string }> {
        return this.request('/plan', 'POST', params);
    }

    /**
     * 4. Create Invoice (Payment Request)
     */
    async createInvoice(params: PaystackInvoiceParams): Promise<{ request_code: string; offline_reference: string }> {
        return this.request('/paymentrequest', 'POST', params);
    }

    /**
     * 5. Webhook Signature Verification
     */
    verifyWebhookSignature(payload: any, signature: string): boolean {
        if (!this.secretKey) return false;

        const hash = crypto
            .createHmac('sha512', this.secretKey)
            .update(JSON.stringify(payload))
            .digest('hex');

        return hash === signature;
    }
}
