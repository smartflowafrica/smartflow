'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface SSEEvents {
    jobs?: any[];
    conversations?: any[];
    appointments?: any[];
    messages?: any[];
    connected?: { message: string; clientId: string; timestamp: string };
    heartbeat?: { timestamp: string };
}

export interface UseSSEOptions {
    onJobs?: (jobs: any[]) => void;
    onConversations?: (conversations: any[]) => void;
    onAppointments?: (appointments: any[]) => void;
    onMessages?: (messages: any[]) => void;
    onConnected?: (data: SSEEvents['connected']) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
}

export function useSSE(options: UseSSEOptions = {}) {
    const { data: session, status } = useSession();
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000;

    const {
        onJobs,
        onConversations,
        onAppointments,
        onMessages,
        onConnected,
        onError,
        enabled = true
    } = options;

    const connect = useCallback(() => {
        if (status !== 'authenticated' || !enabled) {
            return;
        }

        // Close existing connection if any
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        console.log('[SSE] Connecting to stream...');
        const eventSource = new EventSource('/api/sse/stream');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            console.log('[SSE] Connection opened');
            setIsConnected(true);
            setError(null);
            reconnectAttempts.current = 0;
        };

        eventSource.onerror = (e) => {
            console.error('[SSE] Connection error:', e);
            setIsConnected(false);
            eventSource.close();

            // Attempt to reconnect with exponential backoff
            if (reconnectAttempts.current < maxReconnectAttempts) {
                const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current);
                console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);

                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectAttempts.current++;
                    connect();
                }, delay);
            } else {
                const err = new Error('SSE connection failed after max retries');
                setError(err);
                onError?.(err);
            }
        };

        // Listen for specific events
        eventSource.addEventListener('connected', (e) => {
            const data = JSON.parse(e.data);
            console.log('[SSE] Connected:', data);
            onConnected?.(data);
        });

        eventSource.addEventListener('jobs', (e) => {
            const jobs = JSON.parse(e.data);
            console.log('[SSE] Jobs update:', jobs.length, 'jobs');
            onJobs?.(jobs);
        });

        eventSource.addEventListener('conversations', (e) => {
            const conversations = JSON.parse(e.data);
            console.log('[SSE] Conversations update:', conversations.length, 'conversations');
            onConversations?.(conversations);
        });

        eventSource.addEventListener('appointments', (e) => {
            const appointments = JSON.parse(e.data);
            console.log('[SSE] Appointments update:', appointments.length, 'appointments');
            onAppointments?.(appointments);
        });

        eventSource.addEventListener('messages', (e) => {
            const messages = JSON.parse(e.data);
            console.log('[SSE] Messages update:', messages.length, 'messages');
            onMessages?.(messages);
        });

        eventSource.addEventListener('heartbeat', (e) => {
            // Silent heartbeat - just keeps connection alive
        });

    }, [status, enabled, onJobs, onConversations, onAppointments, onMessages, onConnected, onError]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (eventSourceRef.current) {
            console.log('[SSE] Disconnecting...');
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsConnected(false);
    }, []);

    useEffect(() => {
        if (enabled && status === 'authenticated') {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [enabled, status, connect, disconnect]);

    return {
        isConnected,
        error,
        reconnect: connect,
        disconnect,
    };
}

export default useSSE;
