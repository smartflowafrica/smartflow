'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react';

export default function BookingSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [rules, setRules] = useState({
        advanceBookingDays: 30,
        cancellationNoticeHours: 24,
        maxBookingsPerSlot: 1,
        bufferMinutes: 15
    });

    const [slots, setSlots] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/booking/settings')
            .then(res => res.json())
            .then(data => {
                if (data.bookingRule) setRules(data.bookingRule);
                if (data.timeSlots) setSlots(data.timeSlots);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load settings');
                setLoading(false);
            });
    }, []);

    const handleAddSlot = (day: number) => {
        setSlots([...slots, { dayOfWeek: day, startTime: '09:00', endTime: '17:00' }]);
    };

    const handleRemoveSlot = (index: number) => {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        setSlots(newSlots);
    };

    const handleUpdateSlot = (index: number, field: string, value: string) => {
        const newSlots = [...slots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setSlots(newSlots);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/booking/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rules, slots })
            });

            if (res.ok) toast.success('Settings saved');
            else throw new Error('Failed to save');

        } catch (error) {
            toast.error('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Rules Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Booking Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Advance Booking Window (Days)</label>
                        <input
                            type="number"
                            value={rules.advanceBookingDays}
                            onChange={e => setRules({ ...rules, advanceBookingDays: parseInt(e.target.value) })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cancellation Notice (Hours)</label>
                        <input
                            type="number"
                            value={rules.cancellationNoticeHours}
                            onChange={e => setRules({ ...rules, cancellationNoticeHours: parseInt(e.target.value) })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Buffer Between Appointments (Minutes)</label>
                        <input
                            type="number"
                            value={rules.bufferMinutes}
                            onChange={e => setRules({ ...rules, bufferMinutes: parseInt(e.target.value) })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                </div>
            </div>

            {/* Availability Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Weekly Schedule
                    </h3>
                </div>

                <div className="space-y-6">
                    {days.map((dayName, dayIndex) => {
                        const daySlots = slots.filter(s => s.dayOfWeek === dayIndex);

                        return (
                            <div key={dayName} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium w-24">{dayName}</span>
                                    <button
                                        onClick={() => handleAddSlot(dayIndex)}
                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Slot
                                    </button>
                                </div>

                                {daySlots.length === 0 ? (
                                    <div className="text-sm text-slate-400 italic">Unavailable</div>
                                ) : (
                                    <div className="space-y-2">
                                        {slots.map((slot, idx) => {
                                            if (slot.dayOfWeek !== dayIndex) return null;
                                            return (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) => handleUpdateSlot(idx, 'startTime', e.target.value)}
                                                        className="border rounded px-2 py-1 text-sm"
                                                    />
                                                    <span className="text-slate-400">-</span>
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => handleUpdateSlot(idx, 'endTime', e.target.value)}
                                                        className="border rounded px-2 py-1 text-sm"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveSlot(idx)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
}
