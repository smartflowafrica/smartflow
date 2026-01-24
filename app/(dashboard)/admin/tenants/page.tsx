'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TenantsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch('/api/clients', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setClients(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load tenants');
            } finally {
                setIsLoading(false);
            }
        }
        router.refresh(); // Refresh server data
        fetchClients();
    }, [router]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tenants</h1>
                    <p className="text-slate-500">Manage all registered businesses on the platform.</p>
                </div>
                <Link
                    href="/admin/onboarding"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Onboard New Client
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading tenants...</p>
                </div>
            ) : clients.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Tenants Yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Get started by onboarding your first client to the platform.
                    </p>
                    <Link
                        href="/admin/onboarding"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Start Onboarding &rarr;
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Business Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Sector</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Owner</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-center">Stats</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{client.businessName}</div>
                                            <div className="text-slate-500 text-xs">{client.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.sector ? (
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                                                    style={{
                                                        backgroundColor: client.sector.color ? `${client.sector.color}20` : undefined,
                                                        color: client.sector.color
                                                    }}
                                                >
                                                    <span>{client.sector.icon}</span>
                                                    {client.sector.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Unspecified</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700">{client.ownerName}</div>
                                            <div className="text-slate-400 text-xs">{client.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-4 text-xs text-slate-500">
                                                <div title="Users" className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                    {client._count?.users || 0}
                                                </div>
                                                <div title="Customers" className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    {client._count?.customers || 0}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                client.status === 'INACTIVE' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
