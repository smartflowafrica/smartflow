'use client';

import { useState, useEffect } from 'react';
import { BusinessTypeAdapter } from '@/components/client/BusinessTypeAdapter';
import { JobCard } from '@/components/client/JobCard';
import { NewJobModal } from '@/components/client/NewJobModal';
import { UpdateStatusModal } from '@/components/client/UpdateStatusModal';
import { InvoiceModal } from '@/components/client/InvoiceModal';
import { AppointmentModal } from '@/components/client/AppointmentModal';
import { useRealtimeJobs, useRealtimeMessages } from '@/hooks/useRealtime';
import { updateJobStatus } from '@/app/actions/jobs';
import { getClientJobs, getDashboardStats, getRecentAlerts } from '@/app/actions/dashboard';
import { useClient } from '@/hooks/useClient';
import { toast } from 'sonner';

export default function ClientDashboardPage() {
    const { client, isLoading: isClientLoading } = useClient();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const [stats, setStats] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);

    const { jobs: realtimeJobs } = useRealtimeJobs();
    const { messages: realtimeMessages } = useRealtimeMessages();

    // Function to refresh stats after status changes
    const refreshStats = async () => {
        if (!client?.id) return;
        try {
            const statsResult = await getDashboardStats(client.id);
            if (statsResult.success && statsResult.data) {
                setStats(statsResult.data);
            }
        } catch (error) {
            console.error('Failed to refresh stats', error);
        }
    };

    useEffect(() => {
        async function loadDashboardData() {
            if (!client?.id) return;

            try {
                // Load Jobs
                const jobsResult = await getClientJobs(client.id);
                if (jobsResult.success && jobsResult.data) {
                    setJobs(jobsResult.data);
                } else {
                    console.error('Failed to load jobs:', jobsResult.error);
                }

                // Load Stats
                const statsResult = await getDashboardStats(client.id);
                if (statsResult.success && statsResult.data) {
                    setStats(statsResult.data);
                }

                // Load Alerts
                const alertsResult = await getRecentAlerts(client.id);
                if (alertsResult.success && alertsResult.data) {
                    setAlerts(alertsResult.data);
                }
            } catch (error) {
                console.error('Failed to load dashboard data', error);
                toast.error('Failed to update dashboard');
            } finally {
                setIsLoading(false);
            }
        }

        if (client?.id) {
            loadDashboardData();
        }
    }, [client]);

    // Merge realtime jobs with fetched jobs
    useEffect(() => {
        if (realtimeJobs.length > 0) {
            setJobs((prev) => {
                const newJobs = [...realtimeJobs];
                prev.forEach((job) => {
                    if (!newJobs.find((j) => j.id === job.id)) {
                        newJobs.push(job);
                    }
                });
                return newJobs;
            });
        }
    }, [realtimeJobs]);

    // Handle unimplemented actions
    useEffect(() => {
        if (['check_inventory', 'room_service'].includes(activeModal || '')) {
            toast.info('This feature is coming soon!');
            setActiveModal(null);
        }
    }, [activeModal]);

    if (isClientLoading || !client) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Helper to map dynamic stats to business config metrics
    const getMetricValue = (metricId: string) => {
        if (!stats) return 0;

        switch (metricId) {
            case 'messages_today':
                return stats.messagesToday;
            case 'revenue_today':
                return stats.revenueToday;
            case 'cash_collected':
                return stats.cashCollected || 0;

            // Auto Mechanic
            case 'cars_in_shop':
                // Sum of all non-completed/ready statuses
                return (stats.statusCounts['received'] || 0) +
                    (stats.statusCounts['diagnosing'] || 0) +
                    (stats.statusCounts['in_progress'] || 0) +
                    (stats.statusCounts['testing'] || 0);
            case 'ready_for_pickup':
                return stats.statusCounts['ready'] || 0;

            // Restaurant
            case 'orders_today':
                return stats.jobsToday;
            case 'preparing':
                return stats.statusCounts['preparing'] || 0;

            // Salon / Healthcare
            case 'appointments_today':
                return stats.appointmentsToday;
            case 'in_progress':
            case 'in_consultation':
                return stats.statusCounts['in_progress'] || stats.statusCounts['in_consultation'] || 0;
            case 'waiting_patients':
                return stats.statusCounts['arrived'] || 0;

            // Retail
            case 'pending_delivery':
                return stats.statusCounts['out_for_delivery'] || 0;

            // Hotel
            case 'check_ins':
                return stats.statusCounts['checked_in'] || 0; // Approximate
            case 'occupancy':
                // This would require total rooms capacity, which we don't track yet. 
                // Return active reservations count for now.
                return stats.statusCounts['in_house'] || 0;
            case 'requests':
                return 0; // Need ServiceRequest model

            default:
                return 0;
        }
    };



    const handleStatusUpdate = async (jobId: string, newStatus: string) => {
        try {
            const result = await updateJobStatus(jobId, newStatus);
            if (!result.success) throw new Error(result.error);
            toast.success('Status updated!');
            // Refresh jobs and stats
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
            await refreshStats(); // Refresh metrics to update counts
        } catch (error) {
            toast.error('Failed to update status');
            throw error;
        }
    };

    const handleMarkReady = async (jobId: string) => {
        try {
            const result = await updateJobStatus(jobId, 'ready');
            if (!result.success) throw new Error(result.error);
            toast.success('Marked as ready!');
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'ready' } : j));
            await refreshStats(); // Refresh metrics to update Ready for Pickup count
        } catch (error) {
            toast.error('Failed to mark as ready');
            throw error;
        }
    };

    const handleNotifyCustomer = async (jobId: string) => {
        try {
            const res = await fetch(`/api/jobs/${jobId}/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageType: 'ready' })
            });
            if (res.ok) {
                toast.success('Customer notified!');
            } else {
                toast.error('Failed to notify customer');
            }
        } catch (error) {
            toast.error('Failed to notify customer');
        }
    };

    return (
        <BusinessTypeAdapter>
            {(config, client) => (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{client.businessName}</h1>
                            <p className="text-slate-600 mt-1">
                                {config.name} Dashboard
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">
                                {stats?.unreadConversations || 0} unread active conversations
                            </span>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    {alerts.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                            <h3 className="text-red-800 font-semibold flex items-center gap-2">
                                ⚠️ Attention Needed
                            </h3>
                            <div className="space-y-2">
                                {alerts.map(alert => (
                                    <div key={alert.id} className="text-sm text-red-700 bg-white/50 p-2 rounded">
                                        {alert.message}
                                        <div className="text-xs text-red-500 mt-1">
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {config.metrics.map((metric) => (
                            <div
                                key={metric.id}
                                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">{metric.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">
                                            {metric.format === 'currency'
                                                ? `₦${getMetricValue(metric.id).toLocaleString()}`
                                                : getMetricValue(metric.id)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Jobs */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Active {config.terminology.jobs}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                + New {config.terminology.job}
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                                <p className="text-slate-500">No active {config.terminology.jobs.toLowerCase()} yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {jobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        businessType={client.businessType}
                                        onStatusUpdate={handleStatusUpdate}
                                        onMarkReady={handleMarkReady}
                                        onNotifyCustomer={handleNotifyCustomer}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {config.quickActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        if (action.id === 'mark_ready') {
                                            toast.info('Use the "Update Status" action to mark ready');
                                            setActiveModal('update_status');
                                        } else {
                                            setActiveModal(action.id);
                                        }
                                    }}
                                    className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
                                    style={{ borderColor: action.color + '20' }}
                                >
                                    <div className="text-2xl mb-2">{action.icon}</div>
                                    <div className="font-medium text-sm text-slate-900">{action.label}</div>
                                    <div className="text-xs text-slate-500 mt-1">{action.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* New Job Modal */}
                    <NewJobModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        clientId={client.id}
                        businessType={client.businessType}
                        terminology={config.terminology}
                    />

                    {/* Update Status Modal - Phase 1: Reuse for Check-in/out and Delivery Updates */}
                    <UpdateStatusModal
                        isOpen={['update_status', 'update_delivery', 'check_in', 'check_out', 'mark_ready'].includes(activeModal || '')}
                        onClose={() => setActiveModal(null)}
                        clientId={client.id}
                        businessType={client.businessType}
                        terminology={config.terminology}
                        statusStages={config.statusStages}
                    />

                    {/* Invoice/Receipt Modal */}
                    <InvoiceModal
                        isOpen={activeModal === 'generate_invoice' || activeModal === 'generate_receipt'}
                        onClose={() => setActiveModal(null)}
                        clientId={client.id}
                        terminology={config.terminology}
                    />

                    {/* Appointment/Reservation Modal */}
                    <AppointmentModal
                        isOpen={activeModal === 'book_appointment' || activeModal === 'book_reservation'}
                        onClose={() => setActiveModal(null)}
                        terminology={config.terminology}
                        isReservation={activeModal === 'book_reservation'}
                    />
                </div>
            )
            }
        </BusinessTypeAdapter >
    );
}
