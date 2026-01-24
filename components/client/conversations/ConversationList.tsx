'use client';

import { useState } from 'react';

interface Conversation {
    customerPhone: string;
    customerName?: string;
    lastMessage: string;
    lastMessageTime: string;
    handledBy: 'BOT' | 'HUMAN';
    unreadCount?: number;
}

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (customerPhone: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
    const [filter, setFilter] = useState('');

    const filtered = conversations.filter(c =>
        c.customerName?.toLowerCase().includes(filter.toLowerCase()) ||
        c.customerPhone.includes(filter)
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            <div className="p-4 border-b border-slate-100">
                <h2 className="font-semibold text-lg mb-4">Messages</h2>
                <input
                    placeholder="Search..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No conversations found
                    </div>
                ) : (
                    filtered.map((conv) => (
                        <div
                            key={conv.customerPhone}
                            onClick={() => onSelect(conv.customerPhone)}
                            className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedId === conv.customerPhone ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-slate-900 truncate max-w-[70%]">
                                    {conv.customerName || conv.customerPhone}
                                </span>
                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                    {conv.lastMessageTime}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate line-clamp-1">
                                {conv.lastMessage}
                            </p>
                            {conv.handledBy === 'BOT' && (
                                <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                    Bot
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
