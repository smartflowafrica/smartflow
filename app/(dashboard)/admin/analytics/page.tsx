// Analytics Page - No auth needed for data fetching
import { TrendingUp, TrendingDown, Users, MessageSquare, Zap, Globe, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { ChartComponent, ClientPieChart } from '@/components/admin/AnalyticsCharts'
import prisma from '@/lib/prisma'
import { subDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

async function getAnalyticsData() {
    try {
        const thirtyDaysAgo = subDays(new Date(), 30)

        // Parallelize queries for performance
        const [
            clientsCount,
            revenueResult,
            messagesCount,
            botMessagesCount,
            topClients,
            industryBreakdown,
            recentClients,
            recentRevenue
        ] = await Promise.all([
            // 1. Clients Stats
            prisma.client.count(),

            // 2. Revenue (Sum of monthly fees)
            prisma.client.aggregate({
                _sum: { monthlyFee: true }
            }),

            // 3. Total Messages
            prisma.message.count(),

            // 4. Bot Messages (for automation rate)
            prisma.message.count({ where: { handledBy: 'BOT' } }),

            // 5. Top Clients (by customer count)
            prisma.client.findMany({
                take: 5,
                include: { _count: { select: { customers: true } } },
                orderBy: { customers: { _count: 'desc' } }
            }),

            // 6. Industry Breakdown
            prisma.client.groupBy({
                by: ['businessType'],
                _count: { businessType: true }
            }),

            // 7. Recent Client Growth (Last 30 days)
            prisma.client.findMany({
                where: { createdAt: { gte: thirtyDaysAgo } },
                select: { createdAt: true }
            }),

            // 8. Recent Revenue Payments (Last 30 days) - Using SubscriptionPayment
            prisma.subscriptionPayment.findMany({
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    status: 'success'
                },
                select: { createdAt: true, amount: true }
            })
        ])

        const currentRevenue = revenueResult._sum.monthlyFee || 0
        const automationRate = messagesCount > 0 ? (botMessagesCount / messagesCount) * 100 : 0

        // --- Process Data for Charts ---

        // 1. Daily Growth & Revenue
        const chartDataMap = new Map<string, { date: string, revenue: number, clients: number }>();

        // Initialize last 30 days with 0
        for (let i = 29; i >= 0; i--) {
            const d = subDays(new Date(), i);
            const key = format(d, 'MMM dd');
            chartDataMap.set(key, { date: key, revenue: 0, clients: 0 });
        }

        // Fill Client Growth
        recentClients.forEach((c: { createdAt: Date }) => {
            const key = format(c.createdAt, 'MMM dd');
            if (chartDataMap.has(key)) {
                chartDataMap.get(key)!.clients += 1;
            }
        });

        // Fill Revenue Growth
        recentRevenue.forEach((p: { createdAt: Date, amount: number }) => {
            const key = format(p.createdAt, 'MMM dd');
            if (chartDataMap.has(key)) {
                chartDataMap.get(key)!.revenue += (p.amount / 100); // Convert kobo to naira if needed, assuming amount is integer
            }
        });

        const dailyData = Array.from(chartDataMap.values());

        // 2. Industry Data for Pie Chart
        const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        const industryData = industryBreakdown.map((i: any, index: number) => ({
            name: i.businessType.replace('_', ' ').toLowerCase(),
            value: i._count.businessType,
            fill: COLORS[index % COLORS.length]
        }));

        return {
            revenue: {
                current: currentRevenue,
                previous: 0,
                growth: 0,
                chartData: dailyData
            },
            clients: {
                total: clientsCount,
                active: clientsCount,
                new: recentClients.length,
                churn: 0
            },
            messages: {
                total: messagesCount,
                automated: botMessagesCount,
                avgResponseTime: 0
            },
            topClients: topClients.map((c: any) => ({
                name: c.businessName,
                value: c._count.customers,
                industry: c.businessType
            })),
            industryBreakdown: industryData,
            dailyData
        }
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return {
            revenue: { current: 0, previous: 0, growth: 0, chartData: [] },
            clients: { total: 0, active: 0, new: 0, churn: 0 },
            messages: { total: 0, automated: 0, avgResponseTime: 0 },
            topClients: [],
            industryBreakdown: [],
            dailyData: []
        }
    }
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                    <p className="text-slate-500 mt-1">Comprehensive business insights and metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Last 30 Days
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue (MRR)"
                    value={`₦${data.revenue.current.toLocaleString()}`}
                    change="+0%"
                    trend="up"
                    icon={<span className="text-base font-bold font-sans">₦</span>}
                />
                <MetricCard
                    title="Total Clients"
                    value={data.clients.total}
                    change={`+${data.clients.new} new`}
                    trend="up"
                    icon={<Users className="w-5 h-5" />}
                />
                <MetricCard
                    title="Messages Processed"
                    value={data.messages.total.toLocaleString()}
                    change="Lifetime"
                    trend="neutral"
                    icon={<MessageSquare className="w-5 h-5" />}
                />
                <MetricCard
                    title="Automation Rate"
                    value={`${((data.messages.automated / (data.messages.total || 1)) * 100).toFixed(1)}%`}
                    change="Efficiency"
                    trend="up"
                    icon={<Zap className="w-5 h-5" />}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Revenue Trend (30 Days)</h2>
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="h-72 w-full">
                        <ChartComponent data={data.dailyData} type="area" dataKey="revenue" color="#3B82F6" />
                    </div>
                </div>

                {/* Client Growth Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">New Client Signups</h2>
                        <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="h-72 w-full">
                        <ChartComponent data={data.dailyData} type="bar" dataKey="clients" color="#10B981" />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Clients & Industry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Clients */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Clients (by Customer Base)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500">
                                    <th className="pb-3 font-medium">Rank</th>
                                    <th className="pb-3 font-medium">Client Name</th>
                                    <th className="pb-3 font-medium">Industry</th>
                                    <th className="pb-3 font-medium text-right">Customers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.topClients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500">No clients yet</td>
                                    </tr>
                                ) : (
                                    data.topClients.map((client: any, i: number) => (
                                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-3">
                                                <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-xs font-bold text-slate-600">
                                                    {i + 1}
                                                </span>
                                            </td>
                                            <td className="py-3 font-medium text-slate-900">{client.name}</td>
                                            <td className="py-3 text-slate-500 capitalize">{client.industry?.toLowerCase().replace('_', ' ')}</td>
                                            <td className="py-3 text-right font-bold text-slate-700">{client.value}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Industry Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Industry Distribution</h2>
                    <div className="flex-1 min-h-[200px] relative">
                        {data.industryBreakdown.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data yet</div>
                        ) : (
                            <div className="absolute inset-0">
                                <ClientPieChart data={data.industryBreakdown} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, change, trend, icon }: any) {
    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">{title}</span>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className={`text-sm font-medium flex items-center gap-1 ${trendColor}`}>
                {TrendIcon && <TrendIcon className="w-4 h-4" />}
                {change}
            </div>
        </div>
    )
}

function HealthMetric({ label, value, status }: any) {
    const statusColor = status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                <span className="text-sm text-slate-600">{label}</span>
            </div>
            <span className="text-sm font-medium text-slate-900">{value}</span>
        </div>
    )
}
