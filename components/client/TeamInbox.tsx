'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useClient } from '@/hooks/useClient';
import { useRealtimeConversations } from '@/hooks/useRealtime';
import { getConversationMessages, resolveConversation, assignConversation } from '@/app/actions/conversations';
import { getTeamMembers } from '@/app/actions/client';
import {
    Search,
    MoreVertical,
    Send,
    CheckCircle2,
    UserPlus,
    Phone,
    Video,
    Smile,
    Paperclip,
    Clock,
    User,
    RefreshCw,
    MessageSquarePlus
} from 'lucide-react';
import { toast } from 'sonner';
import { CreateConversationModal } from './CreateConversationModal';

interface TeamMember {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'busy';
    avatar?: string;
}

interface Conversation {
    id: string;
    customerName: string;
    customerPhone: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    status: 'needs_human' | 'active' | 'resolved';
    assignedTo?: string;
}

interface ChatMessage {
    id: string;
    text: string;
    sender: 'customer' | 'bot' | 'agent';
    timestamp: string;
}

export default function TeamInbox() {
    const { client } = useClient();
    const { conversations: rawConversations, isLoading: conversationsLoading } = useRealtimeConversations();

    // State
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Team Members
    useEffect(() => {
        if (!client) return;

        async function loadTeam() {
            // ... existing loadTeam logic
            try {
                const res = await getTeamMembers(client!.id);
                if (res?.success && res.data) {
                    setTeamMembers(res.data.map((m: any) => ({
                        id: m.id,
                        name: m.name,
                        status: 'online'
                    })));
                }
            } catch (error) {
                console.error("Failed to load team members", error);
            }
        }
        loadTeam();
    }, [client]);

    // Map rawConversations to Conversation type
    const conversations: Conversation[] = rawConversations.map((c: any) => ({
        id: c.id,
        customerName: c.customerName || 'Unknown Customer',
        customerPhone: c.customerPhone,
        lastMessage: 'Click to view messages',
        lastMessageTime: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unreadCount: c.unreadCount || 0,
        status: c.status?.toLowerCase() || 'active',
        assignedTo: c.assignedTo
    }));

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activeCustomerPhone = activeConversation?.customerPhone;
    const clientId = client?.id;

    // Get raw conversation to check timestamp
    const rawActive = rawConversations.find((c: any) => c.id === activeConversationId);
    const lastMessageAt = rawActive?.lastMessageAt;

    // Fetch Messages for Active Conversation using server action
    const fetchMessages = useCallback(async (isBackground = false) => {
        if (!activeConversationId || !activeCustomerPhone || !clientId) return;

        if (!isBackground) setMessagesLoading(true);
        try {
            const result = await getConversationMessages(clientId, activeCustomerPhone);
            if (result.success && result.data) {
                setMessages(result.data.map((m: any) => ({
                    id: m.id,
                    text: m.messageText,
                    sender: m.handledBy === 'BOT' ? 'bot' : 'customer',
                    timestamp: m.timestamp
                })));
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            if (!isBackground) toast.error('Failed to load messages');
        } finally {
            if (!isBackground) setMessagesLoading(false);
        }
    }, [activeConversationId, activeCustomerPhone, clientId]);

    // Initial load when conversation changes
    useEffect(() => {
        fetchMessages(false);
    }, [activeConversationId, fetchMessages]);

    // Background refresh when new message arrives (timestamp changes)
    useEffect(() => {
        if (lastMessageAt) {
            fetchMessages(true);
        }
    }, [lastMessageAt, fetchMessages]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeConversation || !client) return;

        // Optimistic Update
        const tempId = Date.now().toString();
        setMessages(prev => [...prev, {
            id: tempId,
            text: messageInput,
            sender: 'agent',
            timestamp: new Date().toISOString()
        }]);
        setMessageInput('');

        try {
            const res = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: client.id,
                    text: messageInput
                })
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Message sent');
        } catch (error) {
            toast.error('Failed to send message');
            // Revert optimistic update
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    const handleResolve = async () => {
        if (!activeConversation) return;
        try {
            const result = await resolveConversation(activeConversation.id);
            if (result.success) {
                toast.success('Conversation resolved');
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            toast.error('Error resolving conversation');
        }
    };

    const handleAssign = async (member: TeamMember) => {
        if (!activeConversation) return;
        try {
            const result = await assignConversation(activeConversation.id, member.id, member.name);
            if (result.success) {
                toast.success(`Assigned to ${member.name}`);
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            toast.error('Assignment failed');
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {client && (
                <CreateConversationModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    clientId={client.id}
                    onSuccess={(id) => setActiveConversationId(id)}
                />
            )}

            {/* LEFT COLUMN: Conversation List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-slate-800 text-lg">Chats</h2>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <MessageSquarePlus size={18} />
                            <span>New</span>
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversationsLoading ? (
                        <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-slate-400">Loading conversations...</p>
                        </div>
                    ) : (
                        <>
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    onClick={() => setActiveConversationId(conv.id)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors ${activeConversationId === conv.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-medium text-sm ${conv.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                                            {conv.customerName}
                                        </h3>
                                        <span className="text-xs text-slate-400">{conv.lastMessageTime}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mb-2">{conv.lastMessage}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-mono">{conv.customerPhone}</span>
                                        {conv.status === 'needs_human' && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full">
                                                Needs Attention
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No conversations yet
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* MIDDLE COLUMN: Chat Interface */}
            <div className="flex-1 flex flex-col bg-white">
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {activeConversation.customerName[0]}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900">{activeConversation.customerName}</h2>
                                    <p className="text-xs text-slate-500">{activeConversation.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchMessages(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                                    title="Refresh messages"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleResolve}
                                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Resolve
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${msg.sender === 'agent'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : msg.sender === 'bot'
                                                    ? 'bg-slate-200 text-slate-700 rounded-tl-none border border-slate-300'
                                                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${msg.sender === 'agent' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {msg.sender === 'bot' && ' • AI Assistant'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="text-center text-slate-400 text-sm py-8">
                                            No messages yet
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Smile className="w-5 h-5" /></button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Paperclip className="w-5 h-5" /></button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className={`p-2 rounded-lg transition-all ${messageInput.trim()
                                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 text-slate-300" />
                        </div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Team Status */}
            <div className="w-72 border-l border-slate-200 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-slate-800">Team Status</h2>
                        <Link href="/client/settings?tab=team" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Manage
                        </Link>
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="space-y-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${member.status === 'online' ? 'bg-green-500' :
                                            member.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{member.name}</p>
                                        <p className="text-xs text-slate-400 capitalize">{member.status}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAssign(member)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-opacity"
                                    title={`Assign to ${member.name}`}
                                >
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {teamMembers.length === 0 && (
                            <div className="text-center text-slate-400 text-sm py-4">
                                No team members
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
