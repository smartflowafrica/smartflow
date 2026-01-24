'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const BRANCH_COOKIE_NAME = 'sf_branch_id';

export interface CreateBranchParams {
    name: string;
    address: string;
    phone?: string;
    managerId?: string;
}

/**
 * Creates a new branch for the authenticated user's client.
 */
export async function createBranch(params: CreateBranchParams) {
    try {
        const user = await getCurrentUser();
        if (!user?.email) return { success: false, error: 'Unauthorized' };

        const userRecord = await prisma.user.findUnique({
            where: { email: user.email },
            select: { clientId: true }
        });

        if (!userRecord?.clientId) return { success: false, error: 'User is not linked to a client' };

        const branch = await prisma.branch.create({
            data: {
                ...params,
                clientId: userRecord.clientId,
                isActive: true
            }
        });

        revalidatePath('/admin/settings/branches');
        return { success: true, data: branch };
    } catch (error) {
        console.error('Create Branch Error:', error);
        return { success: false, error: 'Failed to create branch' };
    }
}

/**
 * Gets a list of branches for the authenticated user's client.
 */
export async function getBranches() {
    console.log('getBranches: Starting...');
    try {
        const user = await getCurrentUser();
        console.log('getBranches: User found', user?.email);

        if (!user?.email) return { success: false, error: 'Unauthorized', data: [] };

        const userRecord = await prisma.user.findUnique({
            where: { email: user.email },
            select: { clientId: true }
        });

        if (!userRecord?.clientId) return { success: false, error: 'No client association', data: [] };

        console.log('getBranches: Fetching branches for client', userRecord.clientId);
        const branches = await prisma.branch.findMany({
            where: { clientId: userRecord.clientId, isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        console.log('getBranches: Found branches', branches.length);
        return { success: true, data: branches };
    } catch (error) {
        console.error('Get Branches Error:', error);
        return { success: false, error: 'Failed to fetch branches', data: [] };
    }
}

/**
 * Sets the currently active branch for the session (stored in cookie).
 */
export async function setCurrentBranch(branchId: string) {
    try {
        const cookieStore = cookies();
        cookieStore.set(BRANCH_COOKIE_NAME, branchId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        return { success: true };
    } catch (error) {
        console.error('Set Branch Error:', error);
        return { success: false, error: 'Failed to set branch' };
    }
}

/**
 * Gets the currently selected branch ID from the session cookie.
 */
export async function getCurrentBranchId(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        const branchId = cookieStore.get(BRANCH_COOKIE_NAME)?.value;
        return branchId || null;
    } catch (error) {
        return null;
    }
}

/**
 * Switches to a different branch, or clears selection if null.
 * Alias for setCurrentBranch with null support.
 */
export async function switchBranch(branchId: string | null) {
    try {
        const cookieStore = cookies();
        if (branchId === null) {
            cookieStore.delete(BRANCH_COOKIE_NAME);
        } else {
            cookieStore.set(BRANCH_COOKIE_NAME, branchId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Switch Branch Error:', error);
        return { success: false, error: 'Failed to switch branch' };
    }
}
