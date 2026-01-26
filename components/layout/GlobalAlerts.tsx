'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRealtimeConversations } from '@/hooks/useRealtime';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GlobalAlerts() {
    const { conversations: rawConversations } = useRealtimeConversations();
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());
    const router = useRouter();

    // To handle cross-component sync, we can just poll or rely on mount. 
    // Ideally use a context, but for now let's just read on mount and listen to storage events.
    useEffect(() => {
        const load = () => {
            const saved = localStorage.getItem('smartflow_sound_enabled');
            if (saved !== null) {
                setIsSoundEnabled(saved === 'true');
            }
        };
        load();

        const handleStorage = () => load();
        window.addEventListener('storage', handleStorage);
        // Custom event for same-tab sync
        window.addEventListener('smartflow-sound-toggle', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('smartflow-sound-toggle', handleStorage);
        };
    }, []);

    // Play a "Phone Ring" sound using Web Audio API
    const playNotificationSound = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            // Function to play a single "Ring" burst
            const playBurst = (startTime: number, duration: number) => {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();

                // Standard Phone Ring Frequencies (North American)
                osc1.frequency.value = 440;
                osc2.frequency.value = 480;

                osc1.type = 'sine';
                osc2.type = 'sine';

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                // Envelope
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
                gain.gain.setValueAtTime(0.1, startTime + duration - 0.1);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);

                osc1.start(startTime);
                osc2.start(startTime);
                osc1.stop(startTime + duration);
                osc2.stop(startTime + duration);
            };

            // Pattern: Ring (0.4s) ... gap (0.2s) ... Ring (0.4s)
            const now = ctx.currentTime;
            playBurst(now, 0.4);
            playBurst(now + 0.6, 0.4);

        } catch (e) {
            console.error('Audio play failed', e);
        }
    }, []);

    // Monitor for Needs Human status
    useEffect(() => {
        if (!isSoundEnabled || !rawConversations) return;

        const needsAttention = rawConversations.filter((c: any) =>
            c.status?.toLowerCase() === 'needs_human'
        );

        let played = false;

        needsAttention.forEach((c: any) => {
            if (!alertedIds.has(c.id)) {
                // Play sound
                if (!played) {
                    playNotificationSound();
                    played = true;
                }

                // Track this as alerted
                setAlertedIds(prev => {
                    const next = new Set(prev);
                    next.add(c.id);
                    return next;
                });

                toast.info(`Attention needed: ${c.customerName || 'Customer'}`, {
                    duration: 5000,
                    action: {
                        label: 'Open Details',
                        onClick: () => router.push(`/client/conversations?id=${c.id}`)
                    }
                });
            }
        });

        // Cleanup: Remove IDs if they are no longer needs_human
        if (alertedIds.size > 0) {
            setAlertedIds(prev => {
                const next = new Set(prev);
                let changed = false;
                prev.forEach(id => {
                    const conv = rawConversations.find((rc: any) => rc.id === id);
                    if (!conv || conv.status?.toLowerCase() !== 'needs_human') {
                        next.delete(id);
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }

    }, [rawConversations, isSoundEnabled, alertedIds, playNotificationSound, router]);

    return null; // Invisible component
}
