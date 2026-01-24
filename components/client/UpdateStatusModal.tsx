'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getActiveJobs, updateJobStatus } from '@/app/actions/jobs';

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    businessType: string;
    terminology: { job: string };
    statusStages: Array<{ value: string; label: string; color: string }>;
}

export function UpdateStatusModal({ isOpen, onClose, clientId, businessType, terminology, statusStages }: UpdateStatusModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [activeJobs, setActiveJobs] = useState<any[]>([]);
    const [isFetchingJobs, setIsFetchingJobs] = useState(false);

    // Fetch active jobs when modal opens using server action
    useEffect(() => {
        if (isOpen && clientId) {
            const fetchJobs = async () => {
                setIsFetchingJobs(true);
                try {
                    const result = await getActiveJobs(clientId);
                    if (result.success && result.data) {
                        setActiveJobs(result.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch jobs:', error);
                    toast.error('Failed to load jobs');
                } finally {
                    setIsFetchingJobs(false);
                }
            };
            fetchJobs();
        }
    }, [isOpen, clientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJobId || !selectedStatus) {
            toast.error('Please select a job and status');
            return;
        }

        setIsLoading(true);

        try {
            const result = await updateJobStatus(selectedJobId, selectedStatus);

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(`${terminology.job} status updated!`);
            onClose();
            // Reset form
            setSelectedJobId('');
            setSelectedStatus('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Update {terminology.job} Status</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select {terminology.job}</label>
                        {isFetchingJobs ? (
                            <div className="w-full p-2 border rounded-lg bg-slate-50 text-slate-500 text-sm">
                                Loading jobs...
                            </div>
                        ) : (
                            <select
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                            >
                                <option value="">Choose...</option>
                                {activeJobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.description} - {job.customerName}
                                    </option>
                                ))}
                            </select>
                        )}
                        {activeJobs.length === 0 && !isFetchingJobs && (
                            <p className="text-sm text-slate-500 mt-2">No active jobs found</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">New Status</label>
                        <select
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">Choose...</option>
                            {statusStages.map(stage => (
                                <option key={stage.value} value={stage.value}>
                                    {stage.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !selectedJobId || !selectedStatus}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Check size={18} />
                                Update Status
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
