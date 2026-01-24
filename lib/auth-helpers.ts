import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * Get the current session on the server side
 */
export async function getSession() {
    return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
    const session = await getSession();
    return !!session?.user;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: 'ADMIN' | 'CLIENT') {
    const session = await getSession();
    return (session?.user as any)?.role === role;
}

/**
 * Get the current user's client ID
 */
export async function getCurrentClientId(): Promise<string | null> {
    const session = await getSession();
    return (session?.user as any)?.clientId || null;
}
