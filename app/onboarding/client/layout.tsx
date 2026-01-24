import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClientProfile } from '@/app/actions/client'
import { ClientProvider, type Client } from '@/components/providers/ClientProvider'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    const userEmail = session?.user?.email

    if (!userEmail) {
        redirect('/auth/login?next=/onboarding/client')
    }

    // Fetch client data
    let initialClient: Client | null = null;
    try {
        const result = await getClientProfile();
        if (result?.success && result.data) {
            initialClient = result.data as Client;
        }
    } catch (e) {
        console.error('Failed to fetch client for onboarding', e);
    }

    return (
        <ClientProvider initialClient={initialClient}>
            <div className="min-h-screen bg-slate-50">
                {/* Simple Header for Onboarding */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">S</span>
                        </div>
                        SmartFlow
                    </div>
                    <div className="text-sm text-slate-500">
                        {userEmail}
                    </div>
                </header>

                {children}
            </div>
        </ClientProvider>
    )
}
