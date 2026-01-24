'use client';

import ClientOnboardingWizard from '@/components/client/onboarding/ClientOnboardingWizard';
import { useClient } from '@/hooks/useClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // Added imports

export default function OnboardingPage() {
    const { client, isLoading } = useClient();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If client is already fully setup, maybe redirect? 
    // For now, let's allow accessing this page for "Re-onboarding" or testing.
    // In production, we might check `client.metadata.onboardingComplete`.

    if (isLoading || !isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <h2 className="text-xl font-semibold text-slate-800">Account Not Found</h2>
                <p className="text-slate-500">Please contact support or try logging in again.</p>
                <button onClick={() => router.push('/')} className="text-blue-600 underline">Go Home</button>
            </div>
        );
    }

    return (
        <ClientOnboardingWizard
            clientId={client.id}
            onComplete={() => {
                // Force a refresh or redirect to dashboard
                // We might want to re-fetch client context
                window.location.href = '/client';
            }}
        />
    );
}
