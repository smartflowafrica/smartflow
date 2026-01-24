'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Activity,
    BarChart3,
    Building2
} from 'lucide-react';
import { BranchSelector } from '@/components/layout/BranchSelector';

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );
}

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userEmail = session?.user?.email || '';

    // Only show admin sidebar for /dashboard and /admin routes
    const isAdminRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    // Don't render admin sidebar for client routes
    if (!isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">S</span>
                        </div>
                        SmartFlow
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <BranchSelector />
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
                        Overview
                    </div>
                    <NavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavLink href="/admin/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
                    <NavLink href="/admin/activity" icon={<Activity size={20} />} label="Live Activity" />

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-8">
                        Management
                    </div>
                    <NavLink href="/admin/tenants" icon={<Building2 size={20} />} label="Tenants" />
                    <NavLink href="/admin/sectors" icon={<Building2 size={20} />} label="Business Sectors" />
                    <NavLink href="/admin/users" icon={<Users size={20} />} label="Users" />

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-8">
                        System
                    </div>
                    <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {userEmail ? userEmail[0].toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{userEmail || 'Loading...'}</div>
                            <div className="text-xs text-slate-400">Super Admin</div>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors w-full"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            System Operational
                        </div>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
