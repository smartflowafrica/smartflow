'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

export function NotificationSettings() {
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('smartflow_sound_enabled');
        if (saved !== null) {
            setSoundEnabled(saved === 'true');
        }
    }, []);

    const handleToggle = (enabled: boolean) => {
        setSoundEnabled(enabled);
        localStorage.setItem('smartflow_sound_enabled', String(enabled));
        // Dispatch event for GlobalAlerts to pick up
        window.dispatchEvent(new Event('smartflow-sound-toggle'));
        toast.success(`Sound alerts ${enabled ? 'enabled' : 'disabled'}`);
    };

    const testSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) {
                toast.error("Browser does not support Web Audio API");
                return;
            }

            const ctx = new AudioContext();

            // Re-create the ring pattern from GlobalAlerts
            const playBurst = (startTime: number, duration: number) => {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();

                osc1.frequency.value = 440;
                osc2.frequency.value = 480;
                osc1.type = 'sine';
                osc2.type = 'sine';

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
                gain.gain.setValueAtTime(0.1, startTime + duration - 0.1);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);

                osc1.start(startTime);
                osc2.start(startTime);
                osc1.stop(startTime + duration);
                osc2.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            playBurst(now, 0.4);
            playBurst(now + 0.6, 0.4);

            toast.success("Playing test sound...");

        } catch (e) {
            console.error(e);
            toast.error("Failed to play sound");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                Notification Preferences
            </h2>

            <div className="space-y-8">
                {/* Sound Alert Toggle */}
                <div className="flex items-start justify-between pb-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-medium text-slate-900">Sound Alerts</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Play a sound when a conversation requires human attention (Needs Human).
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={soundEnabled}
                            onChange={(e) => handleToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Test Sound */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-medium text-slate-900">Test Audio</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Verify that your browser allows sound playback.
                        </p>
                    </div>
                    <button
                        onClick={testSound}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                    >
                        <Volume2 size={16} />
                        Test Sound
                    </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800 border border-blue-100">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <div>
                        <p className="font-semibold mb-1">Browser Autoplay Policy</p>
                        <p>
                            Modern browsers may block sound if you haven&apos;t interacted with the page recently.
                            Clicking the &quot;Test Sound&quot; button helps &quot;teach&quot; the browser that you want to hear audio from this site.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
