'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function getSubscriptionPayments(clientId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const payments = await prisma.subscriptionPayment.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return { success: true, data: payments };

    } catch (error) {
        console.error('Fetch Payments Error:', error);
        return { success: false, error: 'Failed to fetch payment history' };
    }
}
