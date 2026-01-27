'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Smartphone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppMonitor({ initialInstances = [] }: { initialInstances?: any[] }) {
    const [instances, setInstances] = useState<any[]>(initialInstances);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/dashboard/status');
            const data = await res.json();
            if (data.instances) setInstances(data.instances);
        } catch (e) {
            toast.error('Failed to refresh instances');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter out instances that might be deleted/closed if the API returns them
    const activeInstances = instances.filter(i => i.instance?.status !== 'close');

    if (activeInstances.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        WhatsApp Connection Monitor
                    </h2>
                    <button onClick={refresh} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={isLoading}>
                        <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''} text-slate-500`} />
                    </button>
                </div>
                <div className="text-center py-8 text-slate-500 text-sm">
                    No WhatsApp instances found.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    WhatsApp Connection Monitor
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                        {activeInstances.length} Active Instances
                    </span>
                    <button onClick={refresh} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={isLoading}>
                        <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''} text-slate-500`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeInstances.map((inst: any) => {
                    const isConnected = inst.instance.status === 'open' || inst.instance.status === 'connected';
                    const name = inst.clientName || inst.instance.instanceName;

                    return (
                        <div key={inst.instance.instanceName} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm truncate max-w-[150px]" title={name}>
                                        {name}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate" title={inst.instance.instanceName}>
                                        ID: {inst.instance.instanceName}
                                    </p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                                    {inst.instance.status === 'open' ? 'CONNECTED' : (inst.instance.status || 'OFFLINE').toUpperCase()}
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                    Owner: {inst.instance.owner || 'N/A'}
                                </span>
                                {!isConnected && inst.clientId && (
                                    // Link to client settings if disconnected
                                    <a
                                        href={`/client/settings?tab=integrations`}
                                        target="_blank"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        Reconnect <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
