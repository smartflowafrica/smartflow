'use client';

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useClient } from '@/hooks/useClient';
import { createCustomer } from '@/app/actions/customers';

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
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Manual Entry State
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');

    const [customers, setCustomers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    // Reset or Prefill
    useEffect(() => {
        if (isOpen) {
            if (appointment) {
                // ... existing edit logic
                setCustomerId(appointment.customerId || '');
                setServiceId(appointment.serviceId || '');
                setNotes(appointment.notes || '');
                const d = new Date(appointment.date);
                setDate(d.toISOString().split('T')[0]);
                setTime(appointment.time || '');
                setIsNewCustomer(false); // Edit mode usually implies existing customer
            } else {
                // Creating (Reset)
                setDate('');
                setTime('');
                setCustomerId('');
                setServiceId('');
                setNotes('');
                setIsNewCustomer(false);
                setNewCustomerName('');
                setNewCustomerPhone('');
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
            let finalCustomerId = customerId;
            let finalCustomerName = '';
            let finalCustomerPhone = '';

            // Handle New Customer Creation
            if (isNewCustomer) {
                if (!newCustomerName || !newCustomerPhone) {
                    toast.error('Name and Phone are required for new customer');
                    setLoading(false);
                    return;
                }

                // Create Customer via Server Action
                const res = await createCustomer(client.id, {
                    name: newCustomerName,
                    phone: newCustomerPhone
                });

                if (!res.success || !res.data) {
                    throw new Error(res.error || 'Failed to create customer');
                }

                finalCustomerId = res.data.id;
                finalCustomerName = res.data.name;
                finalCustomerPhone = res.data.phone; // Assuming returning standarized phone
            } else {
                const existing = customers.find(c => c.id === customerId);
                if (!existing) {
                    toast.error('Please select a customer');
                    setLoading(false);
                    return;
                }
                finalCustomerName = existing.name;
                finalCustomerPhone = existing.phone;
            }

            const body = {
                customerId: finalCustomerId,
                customerName: finalCustomerName,
                customerPhone: finalCustomerPhone,
                serviceId,
                date: `${date}T${time}:00`,
                time,
                notes,
                branchId: client.metadata?.branchId
            };

            // ... (rest of submit logic: fetch /api/booking/appointments)
            let resBooking;
            if (appointment) {
                resBooking = await fetch(`/api/booking/appointments/${appointment.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            } else {
                resBooking = await fetch('/api/booking/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            }

            if (!resBooking.ok) throw new Error('Failed to save appointment');

            toast.success(appointment ? 'Appointment rescheduled' : 'Appointment created successfully');
            onClose();
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save appointment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CalendarIcon size={24} className="text-orange-500" />
                        {appointment ? 'Reschedule Appointment' : 'Book Appointment'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fetching ? (
                            <div className="text-center py-4 text-slate-400">Loading data...</div>
                        ) : (
                            <>
                                {!appointment && (
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mb-2">
                                        <span className="text-sm font-medium text-slate-700">New Walk-in Customer?</span>
                                        <div
                                            onClick={() => setIsNewCustomer(!isNewCustomer)}
                                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isNewCustomer ? 'bg-orange-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isNewCustomer ? 'translate-x-5' : ''}`} />
                                        </div>
                                    </div>
                                )}

                                {isNewCustomer ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. John Doe"
                                                value={newCustomerName}
                                                onChange={e => setNewCustomerName(e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="e.g. 08012345678"
                                                value={newCustomerPhone}
                                                onChange={e => setNewCustomerPhone(e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            />
                                            <p className="text-xs text-slate-400 mt-1">They will receive a confirmation & invoice here.</p>
                                        </div>
                                    </div>
                                ) : (
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
                                )}

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
        </div>
    );
}
// Helper to fetch customers (copied since it's used in useEffect but imported from actions)
import { getCustomers } from '@/app/actions/customers';
