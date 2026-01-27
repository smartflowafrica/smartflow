'use client';

import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export function SystemHealthLogs({ initialLogs = [] }: { initialLogs?: any[] }) {
    const [logs, setLogs] = useState<any[]>(initialLogs);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/dashboard/status');
            const data = await res.json();
            if (data.logs) setLogs(data.logs);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (level: string) => {
        switch (level) {
            case 'ERROR': return <AlertCircle size={16} className="text-red-500" />;
            case 'CRITICAL': return <AlertTriangle size={16} className="text-red-600" />;
            case 'WARNING': return <AlertTriangle size={16} className="text-amber-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-red-50/50">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        System Health
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Recent critical errors & warnings</p>
                </div>
                <button onClick={refresh} className="p-2 hover:bg-white rounded-lg transition-colors" disabled={isLoading}>
                    <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''} text-slate-500`} />
                </button>
            </div>

            <div className="flex-1 overflow-auto max-h-[300px]">
                {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 text-sm">
                        <CheckIcon />
                        <span className="mt-2">All systems operational</span>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 font-medium">Lvl</th>
                                <th className="px-4 py-2 font-medium">Message</th>
                                <th className="px-4 py-2 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 align-top pt-3.5">
                                        <div className="flex flex-col items-center gap-1">
                                            {getIcon(log.level)}
                                            <span className="text-[10px] font-bold text-slate-500">{log.level}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-slate-900 font-medium break-all">{log.message}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Client:
                                            {log.clientId ? (
                                                <Link href={`/admin/tenants?id=${log.clientId}`} className="text-blue-600 hover:underline ml-1">
                                                    {log.clientName}
                                                </Link>
                                            ) : (
                                                <span className="ml-1">{log.clientName}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-slate-400 whitespace-nowrap align-top pt-3.5">
                                        {format(new Date(log.timestamp), 'HH:mm:ss')}<br />
                                        {format(new Date(log.timestamp), 'MMM dd')}
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

function CheckIcon() {
    return (
        <svg className="w-10 h-10 text-green-500 bg-green-100 rounded-full p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
}
