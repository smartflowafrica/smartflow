'use client';

import { useState, useEffect, useRef } from 'react';
import { useClient } from '@/hooks/useClient';
import { toast } from 'sonner';

interface Message {
    id: string;
    clientId: string;
    customerPhone: string;
    customerName?: string;
    messageText: string;
    timestamp: string;
    handledBy: 'BOT' | 'HUMAN';
}

interface ActiveChatProps {
    customerPhone: string;
    messages: Message[];
}

export function ActiveChat({ customerPhone, messages }: ActiveChatProps) {
    const { client } = useClient();
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Filter messages for this customer and sort strictly by time
    const chatMessages = messages
        .filter(m => m.customerPhone === customerPhone)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !client) return;

        setIsSending(true);
        try {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: client.id,
                    customerPhone,
                    messageText: inputText,
                    category: 'manual_reply',
                }),
            });

            if (!response.ok) throw new Error('Failed to send');

            setInputText('');
            // Optimistic update could happen here, but real-time hook will handle it quickly
        } catch (error) {
            toast.error('Failed to send message');
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
                <div>
                    <h2 className="font-semibold text-lg">{chatMessages[0]?.customerName || customerPhone}</h2>
                    <p className="text-xs text-slate-500">{customerPhone}</p>
                </div>
                <div className="flex gap-2">
                    {/* Placeholder actions */}
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">📞</button>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">⋮</button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-10">
                        Start a conversation with this customer.
                    </div>
                ) : (
                    chatMessages.map((msg) => {
                        const isBot = msg.handledBy === 'BOT'; // For now, assume HUMAN send is 'right' side
                        const isMe = msg.handledBy === 'HUMAN'; // Better logic: check direction if added to schema

                        // In our schema, we don't strictly have 'direction' yet.
                        // Assumption: HUMAN handled means we sent it manually (or via dashboard).
                        // BOT handled means auto-response.
                        // But what about efficient inbound from customer?
                        // Usually Inbound handledBy=null or handledBy=BOT if processed.
                        // For MVP: Let's assume everything we see is 'from history'.
                        // I'll align right if it's HUMAN (dashboard) vs Left.

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${isMe
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.messageText}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isBot && ' • Bot'}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white p-4 border-t border-slate-200">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={isSending || !inputText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                        {isSending ? '...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
