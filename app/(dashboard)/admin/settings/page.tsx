import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User, Mail, Shield, Smartphone, Globe, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getProfile() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return null;
        }

        // Fetch profile from Prisma
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        return {
            id: (session.user as any).id || 'unknown',
            email: session.user.email,
            lastSignIn: new Date().toISOString(),
            name: user?.name || session.user.name || 'Administrator',
            role: user?.role || 'ADMIN',
            provider: 'credentials'
        };

    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

export default async function SettingsPage() {
    const profile = await getProfile();

    if (!profile) {
        return (
            <div className="p-8 text-center text-slate-500">
                <p>Failed to load profile settings. Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and system configuration.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-500" />
                        My Profile
                    </h2>
                </div>

                <div className="p-6 border-b border-slate-200 bg-blue-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Branch Management</h3>
                            <p className="text-sm text-slate-500">Manage multiple business locations and outlets.</p>
                        </div>
                        <a
                            href="/admin/settings/branches"
                            className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                        >
                            Manage Branches
                        </a>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header with Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <Shield className="w-3 h-3" />
                                    {profile.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.email}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Authentication Provider</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.provider || 'Email'}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none cursor-not-allowed capitalize"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Last Sign In</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.lastSignIn ? new Date(profile.lastSignIn).toLocaleString() : 'N/A'}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-right">
                    <p className="text-xs text-slate-500">
                        To update your profile information, please contact the system administrator.
                    </p>
                </div>
            </div>

            {/* Application Info (Static but real) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-slate-500" />
                        System Information
                    </h2>
                </div>
                <div className="p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Version</dt>
                            <dd className="mt-1 text-sm text-slate-900">1.0.0 (Beta)</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Environment</dt>
                            <dd className="mt-1 text-sm text-slate-900 capitalize">{process.env.NODE_ENV}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Database</dt>
                            <dd className="mt-1 text-sm text-slate-900">PostgreSQL</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
