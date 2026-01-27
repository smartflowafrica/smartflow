import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export const dynamic = 'force-dynamic'




import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Zap } from 'lucide-react'

import prisma from '@/lib/prisma'
import { WhatsAppMonitor } from '@/components/admin/WhatsAppMonitor';
import { SystemHealthLogs } from '@/components/admin/SystemHealthLogs';
import { RecentSignups } from '@/components/admin/RecentSignups';

async function getStats() {
    try {
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        const [
            totalClients,
            newClientsThisMonth,
            activeJobs,
            messages24h,
            revenueResult
        ] = await Promise.all([
            // 1. Total Clients
            prisma.client.count(),

            // 2. New Clients This Month
            prisma.client.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),

            // 3. Active Jobs (System Wide)
            prisma.job.count({
                where: {
                    status: {
                        notIn: ['completed', 'cancelled', 'ready', 'delivered', 'checked_out']
                    }
                }
            }),

            // 4. Messages in last 24h
            prisma.message.count({
                where: {
                    timestamp: {
                        gte: yesterday
                    }
                }
            }),

            // 5. Monthly Revenue (Sum of fees from ACTIVE clients)
            prisma.client.aggregate({
                where: { status: 'ACTIVE' },
                _sum: { monthlyFee: true }
            })
        ]);

        return {
            totalClients,
            activeJobs,
            messagesProcessed24h: messages24h,
            monthlyRevenue: revenueResult._sum.monthlyFee || 0,
            newClientsThisMonth,
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
        return {
            totalClients: 0,
            activeJobs: 0,
            messagesProcessed24h: 0,
            monthlyRevenue: 0,
            newClientsThisMonth: 0,
        }
    }
}

async function getRecentActivity() {
    try {
        const logs = await prisma.systemLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 5,
        })
        return logs
    } catch (error) {
        console.error('Error fetching recent activity:', error)
        return []
    }
}

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || '';

    // Fetch real stats from database
    const stats = await getStats()
    const recentActivity = await getRecentActivity()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back to SmartFlow Central Command.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats.totalClients.toString()}
                    trend={stats.newClientsThisMonth > 0 ? `+${stats.newClientsThisMonth} this month` : 'No new clients'}
                    trendUp={stats.newClientsThisMonth > 0}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                />
                <StatCard
                    title="Active Jobs"
                    value={stats.activeJobs.toString()}
                    trend="System Wide"
                    trendUp={true}
                    icon={<Zap className="w-5 h-5" />}
                    color="purple"
                />
                <StatCard
                    title="Messages (24h)"
                    value={stats.messagesProcessed24h.toLocaleString()}
                    trend="System Wide"
                    trendUp={stats.messagesProcessed24h > 0}
                    icon={<Activity className="w-5 h-5" />}
                    color="green"
                />
                <StatCard
                    title="Revenue (MRR)"
                    value={`₦${stats.monthlyRevenue.toLocaleString()}`}
                    trend="Projected Monthly"
                    trendUp={true}
                    icon={<span className="text-xl font-bold">₦</span>}
                    color="amber"
                />
            </div>

            {/* WhatsApp Monitor */}
            <div className="w-full">
                <WhatsAppMonitor />
            </div>

            {/* Logs & Signups Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <SystemHealthLogs />
                <RecentSignups />
            </div>

            {/* Recent Activity (Legacy - Consider removing if Logs covers it, but keeping for now) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Live System Activity</h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time events from all clients</p>
                </div>
                {/* ... Hidden for now to favor System Health Logs ... */}
            </div>

            {/* Getting Started Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-2">Ready to Get Started?</h3>
                        <p className="text-sm text-blue-700 mb-4">
                            Your database is connected and ready. Here's what you can do next:
                        </p>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                Add your first client to test the multi-tenant system
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                Configure WhatsApp automation workflows
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                Set up payment integration with Paystack
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, trend, trendUp, icon, color }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 font-medium text-sm">{title}</span>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className={`text-sm font-medium flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-slate-500'}`}>
                {trendUp && value !== '0' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4 opacity-0" />}
                {trend}
            </div>
        </div>
    )
}
