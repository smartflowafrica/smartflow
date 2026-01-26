'use client';

import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { recordJobPayment } from '@/app/actions/jobs';

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    totalAmount: number;
    customerName: string;
}

export function RecordPaymentModal({ isOpen, onClose, jobId, totalAmount, customerName }: RecordPaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(totalAmount?.toString() || '');
    const [method, setMethod] = useState('CASH'); // CASH, TRANSFER, POS

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const numAmount = parseFloat(amount.replace(/,/g, ''));
            if (isNaN(numAmount) || numAmount <= 0) {
                toast.error('Invalid amount');
                setIsLoading(false);
                return;
            }

            const result = await recordJobPayment(jobId, numAmount, method);

            if (result.success) {
                toast.success('Payment recorded & Receipt sent! 🧾');
                onClose();
                // Optional: trigger refresh if needed, but actions usually revalidate path
            } else {
                toast.error(result.error || 'Failed to record payment');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" />
                        Record Payment
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                        Recording payment for <strong>{customerName}</strong>.
                        <br />
                        Reciept will be sent to WhatsApp automatically.
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount Received (₦)</label>
                        <input
                            type="text"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value="CASH">Cash</option>
                            <option value="TRANSFER">Bank Transfer</option>
                            <option value="POS">POS Terminal</option>
                        </select>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 flex justify-center"
                    >
                        {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
