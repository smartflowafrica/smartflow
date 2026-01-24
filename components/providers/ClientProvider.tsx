'use client';

import React, { createContext, useContext, ReactNode } from 'react';

// Define the Client interface to match useClient's expectations
export interface Client {
    id: string;
    businessName: string;
    businessType: string;
    ownerName: string;
    phone: string;
    email: string;
    address?: string;
    planTier: string;
    status: string;
    branding?: {
        logoUrl?: string;
        primaryColor: string;
        secondaryColor: string;
        font: string;
        tagline?: string;
    };
    metadata?: any;
}

interface ClientContextType {
    client: Client | null;
    isLoading: boolean;
    error: Error | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

interface ClientProviderProps {
    children: ReactNode;
    initialClient: Client | null;
}

export function ClientProvider({ children, initialClient }: ClientProviderProps) {
    // If initialClient is provided, we aren't loading and don't have an error yet.
    // Logic can be expanded if we want to support re-fetching/updates, but for now server-state is source of truth.
    // If initialClient is null, it might mean user is not linked, but authentication was successful at layout level?
    // Actually, layout does fetching. If fetching failed (e.g. not authed), initialClient is null.

    // We can assume isLoading is false if we are hydrating from server.

    return (
        <ClientContext.Provider
            value={{
                client: initialClient,
                isLoading: false,
                error: !initialClient ? new Error('No client profile found (Server Context)') : null
            }}
        >
            {children}
        </ClientContext.Provider>
    );
}

export function useClientContext() {
    const context = useContext(ClientContext);
    if (context === undefined) {
        console.error('useClientContext must be used within a ClientProvider');
        // Return a safe fallback to prevent crash and allow debugging
        return {
            client: null,
            isLoading: false,
            error: new Error('ClientContext missing - Component rendered outside ClientProvider')
        };
    }
    return context;
}
