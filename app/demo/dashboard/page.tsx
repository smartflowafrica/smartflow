'use client';

import { useState } from 'react';
import { JobCard } from '@/components/client/JobCard';
import { getBusinessTypeConfig } from '@/lib/config/business-types';

// Mock data
const mockClient = {
    id: 'demo-client-1',
    businessName: 'Quick Fix Auto Repair',
    businessType: 'AUTO_MECHANIC',
    ownerName: 'John Mechanic',
    phone: '08012345678',
    email: 'mechanic@test.com',
    branding: {
        primaryColor: '#EF4444',
        secondaryColor: '#1F2937',
        font: 'Inter',
        logoUrl: null,
    },
};

const mockJobs = [
    {
        id: '1',
        customerPhone: '08087654321',
        customerName: 'Jane Smith',
        description: 'Toyota Camry - Brake pad replacement',
        status: 'in_progress',
        price: 25000,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        customerPhone: '08087654321',
        customerName: 'Jane Smith',
        description: 'Toyota Camry - Oil change and filter',
        status: 'ready',
        price: 8000,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        customerPhone: '08098765432',
        customerName: 'David Johnson',
        description: 'Honda Accord - Engine diagnostics',
        status: 'diagnosing',
        price: 15000,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        customerPhone: '08076543210',
        customerName: 'Michael Brown',
        description: 'Mercedes Benz - AC repair',
        status: 'received',
        price: 45000,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default function DemoPage() {
    const [jobs, setJobs] = useState(mockJobs);
    const [notification, setNotification] = useState<string | null>(null);
    const config = getBusinessTypeConfig(mockClient.businessType);

    const handleStatusUpdate = async (jobId: string, newStatus: string) => {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId
                    ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
                    : job
            )
        );
        showNotification(`Job status updated to: ${config.statusStages.find(s => s.value === newStatus)?.label}`);
    };

    const handleMarkReady = async (jobId: string) => {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId
                    ? { ...job, status: 'ready', updatedAt: new Date().toISOString() }
                    : job
            )
        );
        showNotification('✅ Job marked as ready! Customer will be notified via WhatsApp.');
    };

    const handleNotifyCustomer = async (jobId: string) => {
        const job = jobs.find((j) => j.id === jobId);
        showNotification(`💬 WhatsApp notification sent to ${job?.customerName}`);
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Apply branding
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary-color', mockClient.branding.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', mockClient.branding.secondaryColor);
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
                    {notification}
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{mockClient.businessName}</h1>
                            <p className="text-sm text-slate-600 mt-1">
                                {config.name} Dashboard • <span className="text-green-600">● Live Demo</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{mockClient.ownerName}</p>
                                <p className="text-xs text-slate-500">{mockClient.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                {mockClient.ownerName[0]}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">ℹ️</div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Demo Mode</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                This is a live demonstration of the multi-tenant dashboard features. All data is mock data and updates happen in real-time on this page.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {config.metrics.map((metric) => (
                            <div
                                key={metric.id}
                                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">{metric.label}</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">
                                            {metric.id === 'messages_today' && '12'}
                                            {metric.id === 'cars_in_shop' && jobs.filter(j => j.status !== 'completed').length}
                                            {metric.id === 'ready_for_pickup' && jobs.filter(j => j.status === 'ready').length}
                                            {metric.id === 'revenue_today' && '₦93,000'}
                                        </p>
                                    </div>
                                    <div className="text-4xl">{metric.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Jobs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Active {config.terminology.jobs}
                        </h2>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            + New {config.terminology.job}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                businessType={mockClient.businessType}
                                onStatusUpdate={handleStatusUpdate}
                                onMarkReady={handleMarkReady}
                                onNotifyCustomer={handleNotifyCustomer}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {config.quickActions.map((action) => (
                            <button
                                key={action.id}
                                className="p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                                onClick={() => showNotification(`${action.label} clicked!`)}
                            >
                                <div className="text-3xl mb-2">{action.icon}</div>
                                <div className="font-medium text-sm text-slate-900 group-hover:text-blue-600">
                                    {action.label}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{action.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Business Type Info */}
                <div className="bg-slate-100 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Business Type Configuration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-slate-600">Business Type:</p>
                            <p className="font-medium text-slate-900">{config.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Job Term:</p>
                            <p className="font-medium text-slate-900">{config.terminology.job}</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Customer Term:</p>
                            <p className="font-medium text-slate-900">{config.terminology.customer}</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Status Stages:</p>
                            <p className="font-medium text-slate-900">{config.statusStages.length} stages</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Primary Color:</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: mockClient.branding.primaryColor }}
                                ></div>
                                <p className="font-medium text-slate-900">{mockClient.branding.primaryColor}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
