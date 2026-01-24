'use client';

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useClient } from '@/hooks/useClient';
import { getCustomers } from '@/app/actions/customers';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment?: any; // Appointment to edit
}

export function AppointmentModal({ isOpen, onClose, appointment }: AppointmentModalProps) {
    const { client } = useClient();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [notes, setNotes] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Reset or Prefill
    useEffect(() => {
        if (isOpen) {
            if (appointment) {
                // Editing
                setCustomerId(appointment.customerId || '');
                setServiceId(appointment.serviceId || '');
                setNotes(appointment.notes || '');
                // Date/Time parsing
                const d = new Date(appointment.date);
                setDate(d.toISOString().split('T')[0]);
                // Use stored time string
                setTime(appointment.time || '');
            } else {
                // Creating (Reset)
                setDate('');
                setTime('');
                setCustomerId('');
                setServiceId('');
                setNotes('');
            }
        }
    }, [isOpen, appointment]);

    // Fetch dependencies on open
    useEffect(() => {
        if (!isOpen || !client) return;

        const fetchData = async () => {
            setFetching(true);
            try {
                // Fetch customers via server action
                const resCust = await getCustomers(client.id);
                if (resCust.success) setCustomers(resCust.data || []);

                // Fetch services via API
                // API returns { services: [], total: ... }
                const resServ = await fetch('/api/services?clientId=' + client.id + '&limit=100');
                if (resServ.ok) {
                    const dataServ = await resServ.json();
                    if (Array.isArray(dataServ)) {
                        setServices(dataServ);
                    } else if (dataServ.services && Array.isArray(dataServ.services)) {
                        setServices(dataServ.services);
                    }
                }
            } catch (e) {
                console.error("Failed to load appointment data", e);
                toast.error("Failed to load customers or services");
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [isOpen, client]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;

        setLoading(true);
        try {
            const customer = customers.find(c => c.id === customerId);
            const body = {
                customerId,
                customerName: customer?.name,
                customerPhone: customer?.phone,
                serviceId,
                date: `${date}T${time}:00`, // ISO String for creating Date object on server
                time, // Send explicit time string
                notes,
                branchId: client.metadata?.branchId
            };

            let res;
            if (appointment) {
                // Update
                res = await fetch(`/api/booking/appointments/${appointment.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            } else {
                // Create
                res = await fetch('/api/booking/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            }

            if (!res.ok) throw new Error('Failed to save appointment');

            toast.success(appointment ? 'Appointment rescheduled' : 'Appointment created successfully');
            onClose();
            // Ideally should verify page refresh happen
            window.location.reload(); // Quick fix to refresh list for now
        } catch (error) {
            toast.error('Failed to save appointment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CalendarIcon size={24} className="text-orange-500" />
                        {appointment ? 'Reschedule Appointment' : 'Book Appointment'}
                    </h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {fetching ? (
                        <div className="text-center py-4 text-slate-400">Loading data...</div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Customer</label>
                                <select
                                    required
                                    className="w-full p-2 border rounded-lg bg-white"
                                    value={customerId}
                                    onChange={e => setCustomerId(e.target.value)}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Service</label>
                                <select
                                    required
                                    className="w-full p-2 border rounded-lg bg-white"
                                    value={serviceId}
                                    onChange={e => setServiceId(e.target.value)}
                                >
                                    <option value="">Select Service</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} - {s.price} ({s.duration}m)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Time</label>
                                    <input
                                        required
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Notes</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg"
                                    rows={2}
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Any special requests..."
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 flex justify-center"
                            >
                                {loading ? 'Saving...' : (appointment ? 'Confirm Reschedule' : 'Confirm Booking')}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
