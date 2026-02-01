// User Details Page - Uses Prisma directly
import prisma from '@/lib/prisma';
import { Mail, Shield, Building2, Calendar, User as UserIcon, ArrowLeft, Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UserAuthControl from '@/components/admin/users/UserAuthControl';
import { SystemLog } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function getUserDetails(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                client: true
            }
        });
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function getUserActivity(userId: string) {
    // In a real app, you might want to filter logs by user ID or related client ID
    // For now, if the user is a client, we'll show logs for their client
    // If they are admin, we might show their direct actions (if we tracked user ID in logs, which we currently don't explicitly for all actions)

    // Let's try to fetch logs where the message contains the user's name or email as a heuristic for now, 
    // or better yet, fetch logs for their associated client if they have one.

    try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { clientId: true } });

        if (user?.clientId) {
            return await prisma.systemLog.findMany({
                where: { clientId: user.clientId },
                orderBy: { timestamp: 'desc' },
                take: 20
            });
        }

        return [];
    } catch (error) {
        console.error('Error fetching user activity:', error);
        return [];
    }
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
    const user = await getUserDetails(params.id);

    if (!user) {
        notFound();
    }

    const activities = await getUserActivity(params.id);

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Users
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
                <p className="text-slate-500">View user information and recent activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-3xl font-bold mb-4">
                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user.name || 'Unnamed User'}</h2>
                            <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                                }`}>
                                <Shield className="w-4 h-4" />
                                {user.role}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                    Joined Date
                                </label>
                                <div className="flex items-center gap-2 text-slate-900">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                    Associated Client
                                </label>
                                {user.client ? (
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-2 font-medium text-slate-900 mb-1">
                                            <Building2 className="w-4 h-4 text-slate-500" />
                                            {user.client.businessName}
                                        </div>
                                        <div className="text-xs text-slate-500 pl-6">
                                            {user.client.planTier} Plan • {user.client.status}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-slate-400 italic flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        No client association
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="md:col-span-2 space-y-6">
                    {/* Security Control */}
                    <UserAuthControl userId={user.id} userEmail={user.email} />

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                        </div>

                        {activities.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>No recent activity found for this user's account.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {activities.map((activity: SystemLog) => (
                                    <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg bg-slate-100 flex-shrink-0`}>
                                                {activity.level === 'INFO' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> :
                                                    activity.level === 'WARNING' ? <AlertCircle className="w-4 h-4 text-amber-600" /> :
                                                        activity.level === 'ERROR' ? <XCircle className="w-4 h-4 text-red-600" /> :
                                                            <Activity className="w-4 h-4 text-slate-600" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {activity.message}
                                                    </p>
                                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                                        {new Date(activity.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
