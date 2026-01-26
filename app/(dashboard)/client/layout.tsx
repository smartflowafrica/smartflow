import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClientProfile } from '@/app/actions/client'
import { ClientProvider, type Client } from '@/components/providers/ClientProvider'
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    LogOut,
    Calendar,
    Users,
    Briefcase,
    Tag,
    Package
} from 'lucide-react'
import { BranchSelector } from '@/components/layout/BranchSelector'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { GlobalAlerts } from '@/components/layout/GlobalAlerts'
import { InboxNavLink } from '@/components/layout/InboxNavLink'

export const dynamic = 'force-dynamic'

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    const userEmail = session?.user?.email || ''

    // Fetch client data on server
    let initialClient: Client | null = null;
    try {
        const result = await getClientProfile();
        if (result?.success && result.data) {
            initialClient = result.data as unknown as Client;
            const metadata = initialClient.metadata;
            const isOnboardingComplete = metadata?.onboardingComplete === true;

            if (!isOnboardingComplete && !initialClient.metadata?.hasSkippedOnboarding) {
                const { redirect } = await import('next/navigation');
                redirect('/onboarding/client');
            }
        }
    } catch (e) {
        if ((e as any)?.digest?.startsWith('NEXT_REDIRECT')) {
            throw e;
        }
        console.error('Failed to pre-fetch client profile', e);
    }

    const staffRole = (session?.user as any)?.staffRole || 'OWNER';
    const isOwnerOrManager = staffRole === 'OWNER' || staffRole === 'MANAGER';

    // Fix: Use session name (Agent) instead of Client Owner name
    const sessionName = session?.user?.name;
    const displayName = sessionName || initialClient?.ownerName || (userEmail ? userEmail.split('@')[0] : 'User');

    // Show Role instead of generic 'Client Account'
    const displaySubtitle = staffRole === 'OWNER' ? (initialClient?.businessName || 'Business Owner') : `${staffRole} Account`;

    return (
        <ClientProvider initialClient={initialClient}>
            <GlobalAlerts />
            <div className="flex h-screen bg-slate-50">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <Link href="/client" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                            {initialClient?.branding?.logoUrl ? (
                                <div className="h-8 w-auto max-w-[180px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={initialClient.branding.logoUrl}
                                        alt={initialClient.businessName}
                                        className="h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white">S</span>
                                    </div>
                                    SmartFlow
                                </>
                            )}
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">
                            Location
                        </div>
                        <BranchSelector settingsPath="/client/settings/locations" />

                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-4">
                            Business
                        </div>
                        {isOwnerOrManager && (
                            <NavLink href="/client" icon={<LayoutDashboard size={20} />} label="Overview" />
                        )}
                        <NavLink href="/client/jobs" icon={<Briefcase size={20} />} label="Jobs" />
                        <NavLink href="/client/services" icon={<Tag size={20} />} label="Services" />
                        <InboxNavLink />
                        <NavLink href="/client/appointments" icon={<Calendar size={20} />} label="Appointments" />
                        <NavLink href="/client/customers" icon={<Users size={20} />} label="Customers" />
                        <NavLink href="/client/inventory" icon={<Package size={20} />} label="Inventory" />

                        {isOwnerOrManager && (
                            <>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-8">
                                    Account
                                </div>
                                <NavLink href="/client/settings" icon={<Settings size={20} />} label="Settings" />
                            </>
                        )}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                {displayName[0].toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 truncate" title={displayName}>{displayName}</p>
                                <p className="text-xs text-slate-500 truncate" title={displaySubtitle}>{displaySubtitle}</p>
                            </div>
                        </div>
                        <SignOutButton />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-auto bg-slate-50">
                        <div className="p-4 md:p-8 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ClientProvider>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium"
        >
            <span className="text-slate-400 group-hover:text-blue-500">{icon}</span>
            <span>{label}</span>
        </Link>
    )
}
