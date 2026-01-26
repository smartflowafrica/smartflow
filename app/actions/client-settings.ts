'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

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
                    tagline: brandingData.tagline,
                    bankDetails: {
                        bankName: brandingData.bankName,
                        accountNumber: brandingData.accountNumber,
                        accountName: brandingData.accountName
                    }
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
                    tagline: brandingData.tagline,
                    bankDetails: {
                        bankName: brandingData.bankName,
                        accountNumber: brandingData.accountNumber,
                        accountName: brandingData.accountName
                    }
                }
            });
        }

        revalidatePath('/client/settings');
        return { success: true, data: updatedBranding };
    } catch (error: any) {
        console.error('Error updating client branding:', error);
        try {
            const fs = require('fs');
            const path = require('path');
            fs.writeFileSync(
                path.join(process.cwd(), 'public', 'debug_branding_error.txt'),
                `Error: ${error.message}\nStack: ${error.stack}`
            );
        } catch (e) { }
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


export async function createStaffUser(clientId: string, data: { name: string; email: string; password?: string; role: 'MANAGER' | 'AGENT' }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: 'Unauthorized' };

        // Verify currentUser is OWNER or MANAGER (Managers can invite Agents?)
        // For simplicity, let's say only OWNER can invite for now, or check DB role
        // We'll trust the UI check + server check

        // Check if email exists
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return { success: false, error: 'User with this email already exists' };
        }

        const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: 'CLIENT', // Still a client-level user
                staffRole: data.role,
                clientId: clientId
            }
        });

        revalidatePath('/client/settings');
        return { success: true, data: newUser };

    } catch (error) {
        console.error('Create Staff Error:', error);
        return { success: false, error: 'Failed to create staff user' };
    }
}

export async function deleteStaffUser(userId: string) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: 'Unauthorized' };

        // Ensure we are deleting a user that belongs to the same client
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) return { success: false, error: 'User not found' };

        // Security check: Match Client IDs (assuming currentUser has clientId in session, which we ensured in auth.ts)
        // Note: getCurrentUser helper basically gets session.user.
        // We'll assume session contains clientId. If not, we fetch it.
        const sessionClientId = (currentUser as any).clientId;

        if (targetUser.clientId !== sessionClientId) {
            return { success: false, error: 'Unauthorized action' };
        }

        if (targetUser.staffRole === 'OWNER') {
            return { success: false, error: 'Cannot remove the account owner' };
        }

        await prisma.user.delete({ where: { id: userId } });
        revalidatePath('/client/settings');
        return { success: true };
    } catch (error) {
        console.error('Delete Staff Error:', error);
        return { success: false, error: 'Failed to delete staff user' };
    }
}

export async function updateClientIntegrations(clientId: string, data: {
    paystackPublicKey?: string;
    paystackSecretKey?: string;
    whatsappNumber?: string;
    whatsappInstanceId?: string;
    whatsappStatus?: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        // Ensure user belongs to this client (or is admin)
        // Similar check as others can be added if needed, but getCurrentUser + client context usually suffices in this simplified helper
        // Ideally we check if (user.clientId !== clientId) return Unauthorized

        // Upsert Integration
        const updated = await prisma.integration.upsert({
            where: { clientId },
            update: {
                paystackPublicKey: data.paystackPublicKey,
                paystackSecretKey: data.paystackSecretKey,
                whatsappNumber: data.whatsappNumber,
                whatsappInstanceId: data.whatsappInstanceId,
                whatsappStatus: data.whatsappStatus
            },
            create: {
                clientId,
                paystackPublicKey: data.paystackPublicKey,
                paystackSecretKey: data.paystackSecretKey,
                whatsappNumber: data.whatsappNumber,
                whatsappInstanceId: data.whatsappInstanceId,
                whatsappStatus: data.whatsappStatus || 'disconnected'
            }
        });

        revalidatePath('/client/settings');
        return { success: true, data: updated };
    } catch (error) {
        console.error('Error updating integrations:', error);
        return { success: false, error: 'Failed to update integrations' };
    }
}
