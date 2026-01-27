'use client';

import { useState } from 'react';
import { useBusinessType } from '@/hooks/useBusinessType';
import { toast } from 'sonner';
import { CreditCard, FileText, CheckCircle2, Star } from 'lucide-react';
import { RecordPaymentModal } from './RecordPaymentModal';
import { InspectionModal } from './jobs/InspectionModal';
import { Wrench } from 'lucide-react';

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
        paymentStatus?: string;
        feedbackRating?: number;
        feedbackNotes?: string;
        inspectionData?: any;
        metadata?: any;
        items?: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: number;
        }[];
    };
    businessType: string;
    onStatusUpdate?: (jobId: string, newStatus: string) => Promise<void>;
    onMarkReady?: (jobId: string) => Promise<void>;
    onNotifyCustomer?: (jobId: string) => Promise<void>;
}

export function JobCard({ job, businessType, onStatusUpdate, onMarkReady, onNotifyCustomer }: JobCardProps) {
    const { config, getStatusColor, getStatusLabel } = useBusinessType(businessType);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

    if (!config) return null;

    const statusColor = getStatusColor(job.status);
    const statusLabel = getStatusLabel(job.status);

    // Get dynamic label for "Mark Ready" action
    const markReadyAction = config.quickActions.find(a => a.id === 'mark_ready');
    const markReadyLabel = markReadyAction?.label || 'Mark as Ready';
    const markReadyIcon = markReadyAction?.icon || '✅';

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

    // Helper to render specific metadata details
    const renderBusinessDetails = () => {
        if (!job.metadata) return null;

        // Cast metadata to any to access dynamic properties safely
        const meta = job.metadata as any;

        switch (businessType) {
            case 'HOTEL':
                if (meta.hotel) {
                    return (
                        <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 space-y-1">
                            {meta.hotel.roomNumber && <div className="font-medium">Room: {meta.hotel.roomNumber} ({meta.hotel.roomType})</div>}
                            <div className="flex justify-between">
                                <span>In: {meta.hotel.checkIn}</span>
                                <span>Out: {meta.hotel.checkOut}</span>
                            </div>
                        </div>
                    );
                }
                break;
            case 'RESTAURANT':
                if (meta.restaurant) {
                    return (
                        <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 flex justify-between items-center">
                            {meta.restaurant.tableNumber && <span className="font-medium">Table: {meta.restaurant.tableNumber}</span>}
                            {meta.restaurant.guestCount && <span>Guests: {meta.restaurant.guestCount}</span>}
                        </div>
                    );
                }
                break;
            case 'AUTO_MECHANIC':
                if (meta.vehicle) {
                    return (
                        <div className="bg-slate-50 p-2 rounded text-xs text-slate-600">
                            <div className="font-medium">{meta.vehicle.year} {meta.vehicle.make} {meta.vehicle.model}</div>
                            {meta.vehicle.plate && <div>Plate: {meta.vehicle.plate}</div>}
                        </div>
                    );
                }
                break;
        }
        return null;
    };

    const renderItems = () => {
        if (!job.items || job.items.length === 0) return null;

        return (
            <div className="space-y-1 pt-1">
                <div className="text-xs font-medium text-slate-500 uppercase">
                    {businessType === 'RESTAURANT' ? 'Order Items' : 'Items / Parts'}
                </div>
                <div className="space-y-1">
                    {job.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-700">
                            <span>{item.quantity}x {item.description}</span>
                            {/* Optional: Show price per item or total? Keep it simple for card view */}
                        </div>
                    ))}
                    {job.items.length > 3 && (
                        <div className="text-xs text-slate-400 italic">
                            + {job.items.length - 3} more...
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 line-clamp-1" title={job.description}>{job.description}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {config.terminology.customer}: {job.customerName}
                        </p>
                    </div>
                    <span
                        className="px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap ml-2"
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

                {renderBusinessDetails()}
                {renderItems()}


                {job.price && (
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span className="text-slate-500">Price:</span>
                        <span className="text-green-600">₦{job.price.toLocaleString('en-NG')}</span>
                    </div>
                )}

                {/* Feedback Rating */}
                {job.feedbackRating && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Rating:</span>
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={`${i < (job.feedbackRating || 0) ? 'fill-orange-400 text-orange-400' : 'text-slate-200'}`}
                                />
                            ))}
                        </div>
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

                    {/* Inspection Actions */}
                    {businessType === 'AUTO_MECHANIC' && (
                        <>
                            {job.inspectionData ? (
                                <a
                                    href={`/api/jobs/${job.id}/inspection/pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 border border-purple-200 rounded-md text-purple-700 hover:bg-purple-100 transition-colors shadow-sm"
                                    title="View Inspection Report"
                                >
                                    <FileText size={14} />
                                    Report
                                </a>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsInspectionModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-purple-600 hover:border-purple-200 transition-colors shadow-sm"
                                    title="Start Vehicle Inspection"
                                >
                                    <Wrench size={14} />
                                    Checklist
                                </button>
                            )}
                        </>
                    )}

                    {/* Payment Actions */}
                    {job.paymentStatus !== 'PAID' ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPaymentModalOpen(true);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                                title="Record Payment"
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
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {markReadyIcon} {markReadyLabel}
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


            <RecordPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                jobId={job.id}
                totalAmount={job.price || 0}
                customerName={job.customerName}
            />

            <InspectionModal
                isOpen={isInspectionModalOpen}
                onClose={() => setIsInspectionModalOpen(false)}
                jobId={job.id}
                onSuccess={() => {
                    toast.success('Inspection saved');
                    // Ideally reload jobs or similar, but for now just close
                }}
            />
        </div>
    );
}
