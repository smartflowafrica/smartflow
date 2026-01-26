'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRealtimeConversations } from '@/hooks/useRealtime';
import { useEffect, useState } from 'react';

export function InboxNavLink() {
    const pathname = usePathname();
    const isActive = pathname === '/client/conversations';
    const { conversations } = useRealtimeConversations();
    const [needsHumanCount, setNeedsHumanCount] = useState(0);

    useEffect(() => {
        if (conversations) {
            const count = conversations.filter((c: any) => c.status?.toLowerCase() === 'needs_human').length;
            setNeedsHumanCount(count);
        }
    }, [conversations]);

    return (
        <Link
            href="/client/conversations"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
        >
            <div className="relative">
                <span className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}>
                    <MessageSquare size={20} />
                </span>
                {needsHumanCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 border-2 border-white">
                        {needsHumanCount > 9 ? '9+' : needsHumanCount}
                    </span>
                )}
            </div>
            <div className="flex-1 flex justify-between items-center">
                <span>Team Inbox</span>
                {needsHumanCount > 0 && !isActive && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {needsHumanCount}
                    </span>
                )}
            </div>
        </Link>
    );
}
