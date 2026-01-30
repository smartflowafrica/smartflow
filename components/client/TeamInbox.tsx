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
    MessageSquarePlus,
    ArrowLeft,
    Volume2,
    VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import { CreateConversationModal } from './CreateConversationModal';
import { NOTIFICATION_SOUND } from '@/lib/assets/notification_sound';

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

    // Audio Alert State
    const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Default to ON

    // Load preference from local storage
    useEffect(() => {
        const saved = localStorage.getItem('smartflow_sound_enabled');
        if (saved !== null) {
            setIsSoundEnabled(saved === 'true');
        }
    }, []);

    const toggleSound = () => {
        const newState = !isSoundEnabled;
        setIsSoundEnabled(newState);
        localStorage.setItem('smartflow_sound_enabled', String(newState));
        window.dispatchEvent(new Event('smartflow-sound-toggle'));
    };

    const [showHeaderAssignMenu, setShowHeaderAssignMenu] = useState(false);

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

    // Request Notification Permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    // Track previous 'Needs Human' count to trigger sound
    const prevNeedsHumanRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!isSoundEnabled || conversationsLoading) return;

        const currentNeedsHuman = new Set(
            conversations
                .filter(c => c.status === 'needs_human')
                .map(c => c.id)
        );

        // Check if we have a NEW ticket that wasn't there before
        const hasNewRequest = [...currentNeedsHuman].some(id => !prevNeedsHumanRef.current.has(id));

        if (hasNewRequest) {
            try {
                // 1. Audio Alert
                const audio = new Audio(NOTIFICATION_SOUND);
                audio.play().catch(e => console.error('Audio play failed', e));

                // 2. System Notification (background support)
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Action Required', {
                        body: 'A customer is waiting for a human agent',
                        tag: 'needs-human'
                    });
                }

                // 3. Page Title Flashing
                const originalTitle = document.title;
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                    document.title = flashCount % 2 === 0 ? '🔴 ACTION REQUIRED' : originalTitle;
                    flashCount++;
                    if (flashCount > 10) {
                        clearInterval(flashInterval);
                        document.title = originalTitle;
                    }
                }, 1000);

                toast('New Customer Request', {
                    description: 'A customer is waiting for a human agent.',
                    action: {
                        label: 'View',
                        onClick: () => {
                            const newId = [...currentNeedsHuman].find(id => !prevNeedsHumanRef.current.has(id));
                            if (newId) setActiveConversationId(newId);
                        }
                    }
                });
            } catch (e) {
                console.error('Audio/Notification error', e);
            }
        }

        // Update ref
        prevNeedsHumanRef.current = currentNeedsHuman;
    }, [conversations, isSoundEnabled, conversationsLoading]);


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
        if (!activeConversation) {
            toast.error('No active conversation selected');
            return;
        }

        const toastId = toast.loading('Assigning agent...');

        try {
            console.log('Assigning', activeConversation.id, 'to', member.name);
            const result = await assignConversation(activeConversation.id, member.id, member.name);

            if (result.success) {
                toast.success(`Assigned to ${member.name}`, { id: toastId });
                // Force a reload to reflect changes if SSE is slow
                // In a perfect world, SSE handles this, but for now this ensures visual confirmation
                // router.refresh() might not be enough if using custom hooks
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            console.error('Assignment error', e);
            toast.error('Assignment failed', { id: toastId });
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            {client && (
                <CreateConversationModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    clientId={client.id}
                    onSuccess={(id) => setActiveConversationId(id)}
                />
            )}

            {/* LEFT COLUMN: Conversation List */}
            {/* on mobile: hidden if there is an active conversation */}
            {/* on desktop: always visible */}
            <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-slate-50 shrink-0 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-slate-800 text-lg">Chats</h2>
                        <button
                            onClick={toggleSound}
                            className={`p-2 transition-colors rounded-lg flex items-center gap-2 text-sm font-medium ${isSoundEnabled ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:bg-slate-50'}`}
                            title={isSoundEnabled ? "Mute Notifications" : "Enable Sound Notifications"}
                        >
                            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
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
            {/* on mobile: hidden if NO active conversation. If active, it takes full width. */}
            {/* on desktop: always visible (flex-1) */}
            <div className={`flex-1 flex-col bg-white overflow-hidden ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Mobile Back Button */}
                                <button
                                    onClick={() => setActiveConversationId(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                                >
                                    <ArrowLeft size={20} />
                                </button>

                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                    {activeConversation.customerName[0]}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-slate-900 truncate max-w-[150px] md:max-w-xs">{activeConversation.customerName}</h2>
                                    <p className="text-xs text-slate-500 truncate">{activeConversation.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <button
                                    onClick={() => fetchMessages(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                                    title="Refresh messages"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleResolve}
                                    className="px-2 md:px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> <span className="hidden md:inline">Resolve</span>
                                </button>

                                {/* Header Assignment Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowHeaderAssignMenu(!showHeaderAssignMenu)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                                        title="Assign Agent"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                    </button>

                                    {showHeaderAssignMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1">
                                            <div className="px-3 py-2 border-b border-slate-100 text-xs font-semibold text-slate-500">
                                                Assign to...
                                            </div>
                                            {teamMembers.length > 0 ? (
                                                teamMembers.map(member => (
                                                    <button
                                                        key={member.id}
                                                        onClick={() => {
                                                            handleAssign(member);
                                                            setShowHeaderAssignMenu(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        {member.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-xs text-slate-400">No agents available</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 md:px-5 md:py-3 ${msg.sender === 'agent'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : msg.sender === 'bot'
                                                    ? 'bg-slate-200 text-slate-700 rounded-tl-none border border-slate-300'
                                                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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
                        <div className="p-3 md:p-4 border-t border-slate-200 bg-white shrink-0">
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                <button className="hidden md:block p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Smile className="w-5 h-5" /></button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Paperclip className="w-5 h-5" /></button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 min-w-0"
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
                        <p className="px-4 text-center">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Team Status */}
            <div className="hidden lg:flex w-72 border-l border-slate-200 bg-white flex-col shrink-0">
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
                                    className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded transition-colors border border-slate-200"
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
