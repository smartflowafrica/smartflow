'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Briefcase,
    Tag,
    Package,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { BranchSelector } from '@/components/layout/BranchSelector';
import { InboxNavLink } from '@/components/layout/InboxNavLink';
import { SignOutButton } from '@/components/auth/SignOutButton';

interface ClientMobileNavProps {
    client: any;
    config: any;
    isOwnerOrManager: boolean;
    displayName: string;
    displaySubtitle: string;
}

export function ClientMobileNav({
    client,
    config,
    isOwnerOrManager,
    displayName,
    displaySubtitle
}: ClientMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
                <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
                    {client?.branding?.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={client.branding.logoUrl}
                            alt={client.businessName}
                            className="h-8 w-auto object-contain"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            {client?.businessName ? client.businessName.charAt(0).toUpperCase() : 'S'}
                        </div>
                    )}
                    <span className="truncate max-w-[150px]">{client?.businessName || 'SmartFlow'}</span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-[99] md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[100] transform transition-transform duration-300 md:hidden flex flex-col border-r border-slate-200 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-lg text-slate-900">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">
                        Location
                    </div>
                    {/* Note: BranchSelector uses its own state, might look different on mobile but functional */}
                    <div className="mb-4">
                        <BranchSelector settingsPath="/client/settings/locations" />
                    </div>

                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">
                        Business
                    </div>
                    {isOwnerOrManager && (
                        <MobileNavLink href="/client" icon={<LayoutDashboard size={20} />} label="Overview" onClick={handleLinkClick} />
                    )}
                    <MobileNavLink href="/client/jobs" icon={<Briefcase size={20} />} label={config.terminology.jobs} onClick={handleLinkClick} />
                    <MobileNavLink href="/client/services" icon={<Tag size={20} />} label={config.terminology.services} onClick={handleLinkClick} />

                    {/* Inbox Link needs special handling or just standard link if badge is internal */}
                    <div onClick={handleLinkClick}>
                        <InboxNavLink />
                    </div>

                    <MobileNavLink href="/client/appointments" icon={<Calendar size={20} />} label={config.terminology.calendarLabel || 'Calendar'} onClick={handleLinkClick} />
                    <MobileNavLink href="/client/customers" icon={<Users size={20} />} label={config.terminology.customers} onClick={handleLinkClick} />
                    <MobileNavLink href="/client/inventory" icon={<Package size={20} />} label="Inventory" onClick={handleLinkClick} />

                    {isOwnerOrManager && (
                        <>
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-8">
                                Account
                            </div>
                            <MobileNavLink href="/client/settings" icon={<Settings size={20} />} label="Settings" onClick={handleLinkClick} />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {displayName[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                            <p className="text-xs text-slate-500 truncate">{displaySubtitle}</p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>
        </>
    );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
        >
            <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
