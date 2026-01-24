'use client';

import { useEffect } from 'react';
import { useBusinessType } from '@/hooks/useBusinessType';
import { useClient } from '@/hooks/useClient';
import type { BusinessTypeConfig } from '@/lib/config/business-types';

interface Client {
    id: string;
    businessName: string;
    businessType: string;
    branding?: {
        primaryColor: string;
        secondaryColor: string;
        font: string;
        logoUrl?: string;
    };
}

interface BusinessTypeAdapterProps {
    children: (config: BusinessTypeConfig, client: Client) => React.ReactNode;
}

export function BusinessTypeAdapter({ children }: BusinessTypeAdapterProps) {
    const { client, isLoading, error } = useClient();
    const { config, applyBranding } = useBusinessType(client?.businessType);

    useEffect(() => {
        if (client?.branding && config) {
            applyBranding(client.branding);
        }
    }, [client, config, applyBranding]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-700 font-semibold mb-2">Dashboard Error</p>
                    <p className="text-red-600 text-sm">{error.message}</p>
                    <p className="text-slate-500 text-xs mt-4">Please contact support or try refreshing.</p>
                </div>
            </div>
        );
    }

    if (!client || !config) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-slate-600">No client configuration found</p>
                    <p className="text-xs text-slate-400 mt-2">Business Type: {client?.businessType || 'Unknown'}</p>
                </div>
            </div>
        );
    }

    return <>{children(config, client)}</>;
}
