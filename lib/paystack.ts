export const verifyPaystackPayment = async (reference: string) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error('Paystack secret key not configured');

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${secretKey}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to verify payment');
    }

    const data = await res.json();
    return data.data;
};

export const initializePaystackPayment = async (data: {
    email: string;
    amount: number; // in kobo
    reference?: string;
    callback_url?: string;
    metadata?: any;
}) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error('Paystack secret key not configured');

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to initialize payment');
    }

    return await res.json();
};
