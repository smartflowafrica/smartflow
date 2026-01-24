'use client';

import { useEffect, useState, useCallback } from 'react';
import { useClient } from './useClient';
import { useSSE } from './useSSE';

interface Message {
    id: string;
    clientId: string;
    customerPhone: string;
    customerName?: string;
    messageText: string;
    botResponse?: string;
    category?: string;
    handledBy: 'BOT' | 'HUMAN';
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    timestamp: string;
}

interface Job {
    id: string;
    clientId: string;
    customerId?: string;
    customerPhone: string;
    customerName: string;
    description: string;
    status: string;
    price?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    customer?: {
        name: string;
        phone: string;
    };
}

interface Conversation {
    id: string;
    clientId: string;
    customerId: string;
    status: string;
    lastMessageAt: string;
    unreadCount: number;
    customer?: {
        name: string;
        phone: string;
    };
    _count?: {
        messages: number;
    };
}

interface Appointment {
    id: string;
    clientId: string;
    customerId?: string;
    date: string;
    time: string;
    status: string;
    customer?: {
        name: string;
        phone: string;
    };
    service?: {
        name: string;
    };
}

// Shared SSE connection for all realtime hooks
let sharedSSECallbacks: {
    jobs: ((jobs: Job[]) => void)[];
    conversations: ((conversations: Conversation[]) => void)[];
    appointments: ((appointments: Appointment[]) => void)[];
    messages: ((messages: Message[]) => void)[];
} = {
    jobs: [],
    conversations: [],
    appointments: [],
    messages: [],
};

export function useRealtimeMessages() {
    const { client } = useClient();
    const [messages, setMessages] = useState<Message[]>([]);

    const handleMessages = useCallback((newMessages: Message[]) => {
        setMessages(newMessages);
    }, []);

    useSSE({
        onMessages: handleMessages,
        enabled: !!client,
    });

    return { messages };
}

export function useRealtimeJobs() {
    const { client } = useClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleJobs = useCallback((newJobs: Job[]) => {
        setJobs(newJobs);
        setIsLoading(false);
    }, []);

    const { isConnected, error } = useSSE({
        onJobs: handleJobs,
        enabled: !!client,
    });

    return { jobs, isLoading, isConnected, error };
}

export function useRealtimeConversations() {
    const { client } = useClient();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleConversations = useCallback((newConversations: Conversation[]) => {
        setConversations(newConversations);
        setIsLoading(false);
    }, []);

    const { isConnected, error } = useSSE({
        onConversations: handleConversations,
        enabled: !!client,
    });

    return { conversations, isLoading, isConnected, error };
}

export function useRealtimeAppointments() {
    const { client } = useClient();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleAppointments = useCallback((newAppointments: Appointment[]) => {
        setAppointments(newAppointments);
        setIsLoading(false);
    }, []);

    const { isConnected, error } = useSSE({
        onAppointments: handleAppointments,
        enabled: !!client,
    });

    return { appointments, isLoading, isConnected, error };
}

// Combined hook for dashboard that needs all data
export function useRealtimeDashboard() {
    const { client } = useClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleJobs = useCallback((newJobs: Job[]) => {
        setJobs(newJobs);
        setIsLoading(false);
    }, []);

    const handleConversations = useCallback((newConversations: Conversation[]) => {
        setConversations(newConversations);
    }, []);

    const handleAppointments = useCallback((newAppointments: Appointment[]) => {
        setAppointments(newAppointments);
    }, []);

    const { isConnected, error } = useSSE({
        onJobs: handleJobs,
        onConversations: handleConversations,
        onAppointments: handleAppointments,
        enabled: !!client,
    });

    return {
        jobs,
        conversations,
        appointments,
        isLoading,
        isConnected,
        error
    };
}
