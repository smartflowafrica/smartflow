'use client';

import { useState } from 'react';
import { Users, ExternalLink, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export function RecentSignups({ initialClients = [] }: { initialClients?: any[] }) {
    const [clients, setClients] = useState<any[]>(initialClients);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/dashboard/status');
            const data = await res.json();
            if (data.recentSignups) setClients(data.recentSignups);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Recent Signups
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Newest businesses on the platform</p>
                </div>
                <button onClick={refresh} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={isLoading}>
                    <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''} text-slate-500`} />
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 font-medium">Business</th>
                            <th className="px-4 py-2 font-medium">Type</th>
                            <th className="px-4 py-2 font-medium text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No recent signups</td>
                            </tr>
                        ) : (
                            clients.map((client: any) => (
                                <tr key={client.id} className="hover:bg-slate-50 group">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{client.businessName}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            {client.planTier} • <span className={`w-2 h-2 rounded-full ${client.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-300'}`}></span> {client.status}
                                            <Link href={`/admin/users?clientId=${client.id}`} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                                <ExternalLink size={10} />
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 capitalize">
                                        {client.businessType?.toLowerCase().replace('_', ' ')}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">
                                        {format(new Date(client.createdAt), 'MMM dd')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
