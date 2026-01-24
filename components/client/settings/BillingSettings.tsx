'use client';

import { CreditCard, CheckCircle2, AlertCircle, History, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getSubscriptionPayments } from '@/app/actions/subscription';
// The prompt didn't say I can install packages. "usePaystackEmbed" is from 'react-paystack'.
// I should check if it's installed. If not, I can use the URL returned by my API.
// My API returns `authorizationUrl`. I can just redirect user to that URL.
// That is the standard "Redirect" flow which is easier than Embed for serverside init.
// So I don't need 'react-paystack' package.

interface Payment {
    id: string;
    amount: number;
    status: string;
    date: string;
    reference: string;
}

export default function BillingSettings({ client }: { client: any }) {
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        async function loadPayments() {
            const res = await getSubscriptionPayments(client.id);
            if (res.success && res.data) {
                setPayments(res.data.map((p: any) => ({
                    id: p.id,
                    amount: p.amount,
                    status: p.status,
                    date: p.createdAt.toISOString(),
                    reference: p.reference
                })));
            }
        }
        loadPayments();
    }, [client.id]);


    const handlePay = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/subscription/initialize', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to initialize');

            if (data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
            }
        } catch (error) {
            toast.error('Payment initialization failed');
            console.error(error);
            setLoading(false);
        }
    };

    const statusColor = client.status === 'ACTIVE' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50';

    return (
        <div className="space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Current Subscription</h2>
                        <p className="text-slate-500 text-sm">Manage your billing and plan details</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                        {client.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Plan</p>
                        <p className="text-xl font-bold text-slate-900">{client.planTier}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Amount</p>
                        <p className="text-xl font-bold text-slate-900">
                            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(client.monthlyFee)}
                            <span className="text-xs text-slate-500 font-normal">/month</span>
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Next Billing</p>
                        <p className="text-xl font-bold text-slate-900">
                            {client.nextBillingDate ? new Date(client.nextBillingDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        Secure payment via Paystack
                    </div>
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <CreditCard className="w-4 h-4" />
                                Pay Subscription
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" />
                    <h3 className="text-base font-bold text-slate-900">Payment History</h3>
                </div>

                {!payments || payments.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        No payment history available
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Reference</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 font-mono text-xs">{p.reference}</td>
                                    <td className="px-6 py-4">{new Date(p.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium">
                                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.amount / 100)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs lowercase ${p.status === 'success' ? 'bg-green-100 text-green-700' :
                                            p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
