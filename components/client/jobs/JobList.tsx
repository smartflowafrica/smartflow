'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    MoreVertical,
    Calendar,
    Clock,
    User,
    CheckCircle
} from 'lucide-react';
import { updateJobStatus } from '@/app/actions/jobs';
import { toast } from 'sonner';

interface Job {
    id: string;
    clientId: string;
    customerName: string;
    customerPhone: string;
    description: string;
    status: string;
    priority: string;
    price?: number;
    createdAt: Date;
    dueDate?: Date;
    metadata?: any;
    // Relations included?
    customer?: {
        id: string;
        name: string;
    }
}

interface JobListProps {
    jobs: Job[];
}

export function JobList({ jobs: initialJobs }: JobListProps) {
    const [jobs, setJobs] = useState(initialJobs);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    const filteredJobs = jobs.filter(job => {
        const matchesStatus = filter === 'ALL' || job.status === filter;
        const matchesSearch = job.customerName.toLowerCase().includes(search.toLowerCase()) ||
            job.description.toLowerCase().includes(search.toLowerCase()) ||
            job.customerPhone.includes(search);
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = async (jobId: string, newStatus: string) => {
        try {
            const result = await updateJobStatus(jobId, newStatus);
            if (result.success) {
                setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
                toast.success('Status updated');
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            toast.error('Failed to update status');
        }
    };

    const statusColors: Record<string, string> = {
        'PENDING': 'bg-slate-100 text-slate-700',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700',
        'READY': 'bg-green-100 text-green-700',
        'COMPLETED': 'bg-gray-100 text-gray-700',
        'CANCELLED': 'bg-red-100 text-red-700'
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {['ALL', 'PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${filter === status
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Job Details</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredJobs.map(job => (
                            <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{job.description}</div>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                        {job.priority !== 'MEDIUM' && (
                                            <span className={`font-bold ${job.priority === 'HIGH' || job.priority === 'URGENT' ? 'text-red-500' : 'text-slate-500'}`}>
                                                {job.priority} priority
                                            </span>
                                        )}
                                        {job.price && <span>• ₦{job.price.toLocaleString()}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {job.customerName[0]}
                                        </div>
                                        <div>
                                            <div className="text-slate-900">{job.customerName}</div>
                                            <div className="text-xs text-slate-500">{job.customerPhone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || 'bg-slate-100'}`}>
                                        {job.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5" title="Created">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                        {job.dueDate && (
                                            <span className="flex items-center gap-1.5 text-amber-600" title="Due Date">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(job.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {job.status !== 'COMPLETED' && (
                                            <button
                                                onClick={() => handleStatusChange(job.id, 'COMPLETED')}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                title="Mark Complete"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredJobs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No jobs found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
