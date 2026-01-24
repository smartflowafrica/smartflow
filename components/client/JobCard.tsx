'use client';

import { useState } from 'react';
import { useBusinessType } from '@/hooks/useBusinessType';
import { toast } from 'sonner';
import { CreditCard, FileText, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
    job: {
        id: string;
        customerPhone: string;
        customerName: string;
        description: string;
        status: string;
        price?: number;
        createdAt: string;
        updatedAt: string;
        paymentStatus?: string; // Optional for now until safe
    };
    businessType: string;
    onStatusUpdate?: (jobId: string, newStatus: string) => Promise<void>;
    onMarkReady?: (jobId: string) => Promise<void>;
    onNotifyCustomer?: (jobId: string) => Promise<void>;
}

export function JobCard({ job, businessType, onStatusUpdate, onMarkReady, onNotifyCustomer }: JobCardProps) {
    const { config, getStatusColor, getStatusLabel } = useBusinessType(businessType);
    const [isUpdating, setIsUpdating] = useState(false);

    if (!config) return null;

    const statusColor = getStatusColor(job.status);
    const statusLabel = getStatusLabel(job.status);

    const handleStatusChange = async (newStatus: string) => {
        if (!onStatusUpdate) return;
        setIsUpdating(true);
        try {
            await onStatusUpdate(job.id, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMarkReady = async () => {
        if (!onMarkReady) return;
        setIsUpdating(true);
        try {
            await onMarkReady(job.id);
        } catch (error) {
            console.error('Failed to mark as ready:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleNotify = async () => {
        if (!onNotifyCustomer) return;
        setIsUpdating(true);
        try {
            await onNotifyCustomer(job.id);
        } catch (error) {
            console.error('Failed to notify customer:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{job.description}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {config.terminology.customer}: {job.customerName}
                        </p>
                    </div>
                    <span
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: statusColor }}
                    >
                        {statusLabel}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Started:</span>
                    <span className="text-slate-900">
                        {new Date(job.createdAt).toLocaleString('en-NG', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>

                {job.price && (
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span className="text-slate-500">Price:</span>
                        <span className="text-green-600">₦{job.price.toLocaleString('en-NG')}</span>
                    </div>
                )}

                {/* Status Selector */}
                <div className="pt-2">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                        {config.terminology.statusLabel}:
                    </label>
                    <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {config.statusStages.map((stage) => (
                            <option key={stage.value} value={stage.value}>
                                {stage.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">#{job.id.slice(-6)}</span>

                <div className="flex gap-2">
                    {/* Mark Ready Button (Renamed/Styled as needed) */}

                    {/* Payment Actions */}
                    {job.paymentStatus !== 'PAID' ? (
                        <>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const res = await fetch(`/api/jobs/${job.id}/payment/initialize`, { method: 'POST' });
                                        const data = await res.json();
                                        if (data.paymentUrl) {
                                            window.open(data.paymentUrl, '_blank');
                                        } else {
                                            toast.error('Failed to generate link');
                                        }
                                    } catch (err) { toast.error('Error generating link'); }
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                                title="Pay Now"
                            >
                                <CreditCard size={14} />
                                Pay
                            </button>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const res = await fetch('/api/invoices', {
                                            method: 'POST',
                                            body: JSON.stringify({ jobId: job.id })
                                        });
                                        if (res.ok) toast.success('Invoice sent to WhatsApp');
                                        else toast.error('Failed to send invoice');
                                    } catch (err) { toast.error('Error sending invoice'); }
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm"
                                title="Send Invoice via WhatsApp"
                            >
                                <FileText size={14} />
                                Invoice
                            </button>
                        </>
                    ) : (
                        <span className="flex items-center gap-1 text-green-600 font-bold px-2 py-1 bg-green-50 rounded-md">
                            <CheckCircle2 size={14} />
                            PAID
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMarkReady();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={isUpdating || job.status === 'ready'}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {config.quickActions.find((a) => a.id === 'mark_ready')?.icon || '✅'} Mark as Ready
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNotify();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    💬 Notify Customer
                </button>
            </div>
        </div>
    );
}
