'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2, Building2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCardProps {
    jobId: string;
    amount: number;
    description: string;
    customerName: string;
    customerEmail?: string;
    bankDetails?: any;
    hasPaystack?: boolean;
}

export default function PaymentCard({ jobId, amount, description, customerName, customerEmail, bankDetails, hasPaystack }: PaymentCardProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'CARD' | 'BANK'>(hasPaystack ? 'CARD' : 'BANK');
    const [transferConfirmed, setTransferConfirmed] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/jobs/${jobId}/payment/initialize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Payment initialization failed');
            }

            if (data.paymentUrl) {
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

    const handleTransferConfirmation = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/jobs/${jobId}/payment/confirm-transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                setTransferConfirmed(true);
                toast.success('Thanks! We have requested your proof of payment on WhatsApp.');
            } else {
                toast.error('Failed to notify system');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
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

                {/* Mode Selector */}
                {hasPaystack && bankDetails && (
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                        <button
                            onClick={() => setMode('CARD')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'CARD' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Pay Online
                        </button>
                        <button
                            onClick={() => setMode('BANK')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'BANK' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            Bank Transfer
                        </button>
                    </div>
                )}

                {mode === 'CARD' && hasPaystack ? (
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
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">

                        {!bankDetails ? (
                            <div className="text-center text-slate-500 text-sm py-4">
                                No bank details available. Please contact the business.
                            </div>
                        ) : (
                            <>
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> Bank Transfer
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                                        <span className="text-slate-500">Bank Name</span>
                                        <span className="font-medium text-slate-900">{bankDetails.bankName}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                                        <span className="text-slate-500">Account Name</span>
                                        <span className="font-medium text-slate-900 text-right">{bankDetails.accountName}</span>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded border border-blue-100 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs text-blue-600 uppercase font-bold tracking-wider">Account Number</span>
                                            <div className="text-xl font-mono font-bold text-slate-900">{bankDetails.accountNumber}</div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                            className="p-2 hover:bg-blue-100 rounded text-blue-600"
                                            title="Copy Account Number"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 italic mt-2">
                                    Please use <strong>#{jobId.slice(0, 6)}</strong> as the transfer description/narration.
                                </div>

                                {transferConfirmed ? (
                                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex flex-col items-center text-center">
                                        <CheckCircle className="w-8 h-8 mb-2" />
                                        <p className="font-medium">Notification Sent!</p>
                                        <p className="text-sm mt-1">Please check your WhatsApp to upload the payment proof.</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleTransferConfirmation}
                                        disabled={isProcessing}
                                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        I have made the transfer
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-medium pt-2">
                    <Lock className="w-3 h-3" />
                    <span className="opacity-90">Secure Payment Environment</span>
                </div>
            </div>
        </div>
    );
}
