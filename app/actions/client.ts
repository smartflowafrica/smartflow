'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function getClientProfile() {
    try {
        const authUser = await getCurrentUser();

        if (!authUser || !authUser.email) {
            console.log('getClientProfile: No auth user found');
            return { success: false, error: 'User not authenticated' };
        }

        // Fetch User and linked Client from Prisma
        const user = await prisma.user.findUnique({
            where: { email: authUser.email },
            include: {
                client: {
                    include: {
                        branding: true
                    }
                }
            }
        });

        if (!user) {
            return { success: false, error: 'User account not found in database' };
        }

        if (!user.client) {
            return { success: false, error: 'No client profile associated with this account' };
        }

        return {
            success: true,
            data: {
                id: user.client.id,
                businessName: user.client.businessName,
                businessType: user.client.businessType,
                ownerName: user.client.ownerName,
                phone: user.client.phone,
                email: user.client.email || authUser.email || '',
                address: user.client.address || undefined,
                planTier: user.client.planTier,
                status: user.client.status,
                metadata: user.client.metadata,
                branding: user.client.branding ? {
                    logoUrl: user.client.branding.logoUrl || undefined,
                    primaryColor: user.client.branding.primaryColor,
                    secondaryColor: user.client.branding.secondaryColor,
                    font: user.client.branding.font || 'Inter',
                    tagline: user.client.branding.tagline || undefined,
                } : undefined
            }
        };

    } catch (error) {
        console.error('Error in getClientProfile:', error);
        return { success: false, error: 'Internal server error while fetching profile' };
    }
}

export async function getTeamMembers(clientId: string) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) return { success: false, error: 'Unauthorized' };

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!client) return { success: false, error: 'Client not found' };

        const registeredMembers = client.user ? [{
            id: client.user.id,
            name: client.user.role === 'CLIENT' || client.user.role === 'ADMIN' ? (client.ownerName || client.user.email.split('@')[0]) : client.user.email.split('@')[0],
            status: 'online',
            role: client.user.role,
            type: 'USER'
        }] : [];

        const metadata = client.metadata as any;
        const manualMembers = (metadata?.whatsappConfig?.teamMembers || []).map((name: string, idx: number) => ({
            id: `manual_${idx}`,
            name: name,
            status: 'offline',
            role: 'STAFF',
            type: 'MANUAL'
        }));

        return {
            success: true,
            data: [...registeredMembers, ...manualMembers]
        };

    } catch (error) {
        console.error('Get Team Error:', error);
        return { success: false, error: 'Failed to fetch team' };
    }
}
