'use client';

import { useSSE } from '@/hooks/useSSE';

interface SSEStatusProps {
    showLabel?: boolean;
    className?: string;
}

export function SSEStatus({ showLabel = false, className = '' }: SSEStatusProps) {
    const { isConnected, error } = useSSE({ enabled: true });

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div
                className={`w-2 h-2 rounded-full ${error
                        ? 'bg-red-500'
                        : isConnected
                            ? 'bg-green-500 animate-pulse'
                            : 'bg-yellow-500'
                    }`}
                title={
                    error
                        ? 'Connection error'
                        : isConnected
                            ? 'Realtime connected'
                            : 'Connecting...'
                }
            />
            {showLabel && (
                <span className="text-xs text-slate-500">
                    {error
                        ? 'Offline'
                        : isConnected
                            ? 'Live'
                            : 'Connecting'}
                </span>
            )}
        </div>
    );
}

export default SSEStatus;
