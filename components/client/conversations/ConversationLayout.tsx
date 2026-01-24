'use client';

import { useState } from 'react';
import { useRealtimeMessages, useRealtimeConversations } from '@/hooks/useRealtime';
import { ConversationList } from './ConversationList';
import { ActiveChat } from './ActiveChat';
import { useClient } from '@/hooks/useClient';

export function ConversationLayout() {
    const { client } = useClient();
    const { conversations } = useRealtimeConversations();
    const { messages } = useRealtimeMessages(); // Fetches all messages for now
    const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

    if (!client) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar - List */}
            <div className={`w-full md:w-80 flex-shrink-0 ${selectedPhone ? 'hidden md:flex' : 'flex'}`}>
                <ConversationList
                    conversations={conversations}
                    selectedId={selectedPhone}
                    onSelect={setSelectedPhone}
                />
            </div>

            {/* Main - Chat */}
            <div className={`flex-1 flex flex-col ${!selectedPhone ? 'hidden md:flex' : 'flex'}`}>
                {selectedPhone ? (
                    <>
                        <div className="md:hidden p-2 bg-slate-50 border-b">
                            <button onClick={() => setSelectedPhone(null)} className="text-sm text-blue-600 font-medium">
                                ← Back to List
                            </button>
                        </div>
                        <ActiveChat
                            customerPhone={selectedPhone}
                            messages={messages}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
                        <div className="text-center">
                            <div className="text-4xl mb-4">💬</div>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
