'use client';

import { useState, useEffect } from 'react';
import { Search, CreditCard, DollarSign, CheckCircle, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminBillingPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const url = searchQuery
                ? `/api/admin/billing?search=${encodeURIComponent(searchQuery)}`
                : '/api/admin/billing';

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setPayments(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timeout = setTimeout(() => fetchPayments(), 500);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    // Stats
    const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + (p.amount / 100), 0); // Assuming amount is in kobo/cents

    const failedCount = payments.filter(p => p.status !== 'success').length;

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Billing & Transactions</h1>
                    <p className="text-slate-500">Track all subscription payments across the platform.</p>
                </div>
                <button
                    onClick={fetchPayments}
                    className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                    <RefreshCw size={20} className="text-slate-500" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-900">₦{totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Transactions</p>
                        <h3 className="text-2xl font-bold text-slate-900">{payments.length}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Failed/Pending</p>
                        <h3 className="text-2xl font-bold text-slate-900">{failedCount}</h3>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Reference ID or Business Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Client</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Reference</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                        Wait while we check the ledger...
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{payment.client?.businessName || 'Unknown Client'}</div>
                                            <Link
                                                href={`/admin/tenants?id=${payment.client?.id}`}
                                                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                            >
                                                View Profile <ExternalLink size={10} />
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {payment.reference}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            ₦{(payment.amount / 100).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${payment.status === 'success'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {payment.status === 'success' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-500 capitalize">
                                            {payment.paymentMethod || 'Paystack'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
