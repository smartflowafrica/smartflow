'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function syncUser() {
    try {
        const user = await getCurrentUser();

        if (!user || !user.email) {
            return { success: false, error: 'No authenticated user found' };
        }

        // Check if user exists in DB
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (existingUser) {
            return { success: true, userId: existingUser.id, isNew: false };
        }

        // If not, create them
        console.log(`syncUser: Creating missing user record for ${user.email}`);

        const client = await prisma.client.create({
            data: {
                ownerName: user.name || 'Admin',
                email: user.email,
                businessName: 'My Business',
                phone: '0000000000',
                businessType: 'OTHER',
                monthlyFee: 0
            }
        });

        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name || 'Admin',
                role: 'CLIENT',
                clientId: client.id
            }
        });

        return { success: true, userId: newUser.id, isNew: true };

    } catch (error) {
        console.error('syncUser Error:', error);
        return { success: false, error: 'Failed to sync user' };
    }
}
