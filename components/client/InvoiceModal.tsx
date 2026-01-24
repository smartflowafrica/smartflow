'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { getActiveJobs } from '@/app/actions/jobs';
import { toast } from 'sonner';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    terminology: { job: string };
}

export function InvoiceModal({ isOpen, onClose, clientId, terminology }: InvoiceModalProps) {
    const [activeJobs, setActiveJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && clientId) {
            const fetchJobs = async () => {
                setIsLoading(true);
                try {
                    const result = await getActiveJobs(clientId);
                    if (result.success && result.data) {
                        setActiveJobs(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching jobs:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchJobs();
        }
    }, [isOpen, clientId]);

    const handleGenerate = async () => {
        if (!selectedJob || !amount) return;

        setIsLoading(true);
        try {
            // First update job with final amount
            const updateRes = await fetch(`/api/jobs/${selectedJob.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finalAmount: parseFloat(amount) })
            });

            // Generate and send invoice
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: selectedJob.id })
            });

            if (!res.ok) {
                throw new Error('Failed to generate invoice');
            }

            const result = await res.json();

            if (result.emailSent) {
                toast.success(`Invoice sent to ${selectedJob.customerName}'s email!`);
            } else {
                toast.success(`Invoice generated for ${selectedJob.customerName}!`);
            }

            onClose();
        } catch (error) {
            console.error('Invoice error:', error);
            toast.error('Failed to generate invoice');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText size={24} className="text-blue-600" />
                        Generate Invoice
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select {terminology.job}</label>
                        {isLoading ? (
                            <div className="w-full p-2 border rounded-lg bg-slate-50 text-slate-500 text-sm">
                                Loading jobs...
                            </div>
                        ) : (
                            <select
                                className="w-full p-2 border rounded-lg"
                                onChange={(e) => {
                                    const job = activeJobs.find(j => j.id === e.target.value);
                                    setSelectedJob(job);
                                }}
                            >
                                <option value="">Choose...</option>
                                {activeJobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.description} - {job.customerName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amount (₦)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="0.00"
                        />
                    </div>

                    {selectedJob && (
                        <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Customer:</span>
                                <span className="font-medium">{selectedJob.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Service:</span>
                                <span className="font-medium">{selectedJob.description}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date:</span>
                                <span className="font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={!selectedJob || !amount || isLoading}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        {isLoading ? 'Generating...' : 'Generate Invoice'}
                    </button>
                </div>
            </div>
        </div>
    );
}
