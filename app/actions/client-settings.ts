'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateClientProfile(clientId: string, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: {
                businessName: data.businessName,
                businessType: data.businessType,
                phone: data.phone,
                address: data.address,
            }
        });

        revalidatePath('/client/settings');
        revalidatePath('/client');

        return { success: true, data: updatedClient };
    } catch (error) {
        console.error('Error updating client profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

export async function updateClientBranding(clientId: string, brandingData: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: { branding: true }
        });

        if (!client) return { success: false, error: 'Client not found' };

        let updatedBranding;

        if (client.branding) {
            updatedBranding = await prisma.branding.update({
                where: { clientId },
                data: {
                    primaryColor: brandingData.primaryColor,
                    secondaryColor: brandingData.secondaryColor,
                    font: brandingData.font,
                    logoUrl: brandingData.logoUrl,
                    tagline: brandingData.tagline
                }
            });
        } else {
            updatedBranding = await prisma.branding.create({
                data: {
                    clientId,
                    primaryColor: brandingData.primaryColor,
                    secondaryColor: brandingData.secondaryColor,
                    font: brandingData.font,
                    logoUrl: brandingData.logoUrl,
                    tagline: brandingData.tagline
                }
            });
        }

        revalidatePath('/client/settings');
        return { success: true, data: updatedBranding };
    } catch (error) {
        console.error('Error updating client branding:', error);
        return { success: false, error: 'Failed to update branding' };
    }
}

export async function updateClientTeam(clientId: string, teamMembers: string[]) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            select: { metadata: true }
        });

        if (!client) return { success: false, error: 'Client not found' };

        const currentMetadata = client.metadata as any || {};
        const whatsappConfig = currentMetadata.whatsappConfig || {};

        const updatedMetadata = {
            ...currentMetadata,
            whatsappConfig: {
                ...whatsappConfig,
                teamMembers: teamMembers
            }
        };

        await prisma.client.update({
            where: { id: clientId },
            data: { metadata: updatedMetadata }
        });

        revalidatePath('/client/settings');
        revalidatePath('/client/conversations');

        return { success: true };
    } catch (error) {
        console.error('Error updating team:', error);
        return { success: false, error: 'Failed to update team' };
    }
}
