'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCardProps {
    jobId: string;
    amount: number;
    description: string;
    customerName: string;
    customerEmail?: string;
}

export default function PaymentCard({ jobId, amount, description, customerName, customerEmail }: PaymentCardProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/jobs/${jobId}/payment/initialize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}) // API derives info from DB for security
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Payment initialization failed');
            }

            if (data.paymentUrl) {
                // Redirect to Paystack
                window.location.href = data.paymentUrl;
            } else {
                toast.error('Failed to get payment URL');
                setIsProcessing(false);
            }

        } catch (error: any) {
            console.error('Payment Error:', error);
            toast.error(error.message || 'Something went wrong');
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-8">
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Customer</label>
                    <p className="text-slate-800 font-medium">{customerName}</p>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Service</label>
                    <p className="text-slate-800 font-medium">{description}</p>
                </div>

                <div className="pt-4 pb-6 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-end">
                        <span className="text-slate-500 font-medium">Total Amount</span>
                        <span className="text-4xl font-bold text-slate-900">
                            <span className="text-xl align-top text-slate-500 mr-1">NGN</span>
                            {amount.toLocaleString()}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pay Now
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    <span className="opacity-90">256-bit Secure Encrypted Payment</span>
                </div>
            </div>
        </div>
    );
}
