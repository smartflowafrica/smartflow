import prisma from '@/lib/prisma';
import { Activity, CheckCircle2, AlertCircle, UserPlus, FileText, Settings, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getActivities() {
    try {
        const logs = await prisma.systemLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50,
        });
        return logs;
    } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
}

export default async function ActivityPage() {
    const activities = await getActivities();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Live Activity</h1>
                <p className="text-slate-500">Real-time system events and audit logs.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">System Logs</h2>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Connection
                    </div>
                </div>

                {activities.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Activity Yet</h3>
                        <p className="text-slate-500">System logs will appear here once activity is recorded.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {activities.map((activity) => (
                            <div key={activity.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg bg-slate-100 flex-shrink-0`}>
                                        {activity.level === 'INFO' ? <CheckCircle2 className="w-5 h-5 text-blue-600" /> :
                                            activity.level === 'WARNING' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                                                activity.level === 'ERROR' ? <XCircle className="w-5 h-5 text-red-600" /> :
                                                    <Activity className="w-5 h-5 text-slate-600" />}
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
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">
                                                Level:
                                                <span className={`ml-1 font-medium ${activity.level === 'INFO' ? 'text-blue-600' :
                                                        activity.level === 'WARNING' ? 'text-amber-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {activity.level}
                                                </span>
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
    );
}
