'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAppointmentSchema, CreateAppointmentData } from '@/lib/schemas/appointment';
import { useClient } from '@/hooks/useClient';
import { toast } from 'sonner';

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: Date;
}

export function CreateAppointmentModal({ isOpen, onClose, selectedDate }: CreateAppointmentModalProps) {
    const { client } = useClient();
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<CreateAppointmentData>({
        resolver: zodResolver(createAppointmentSchema),
        defaultValues: {
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            time: '09:00',
        }
    });

    useEffect(() => {
        if (isOpen && client) {
            setValue('clientId', client.id);
            if (selectedDate) {
                setValue('date', selectedDate.toISOString().split('T')[0]);
            }

            // Fetch services via API
            const fetchServices = async () => {
                try {
                    const response = await fetch('/api/services?isActive=true');
                    if (response.ok) {
                        const data = await response.json();
                        setServices(data.services || []);
                    }
                } catch (error) {
                    console.error('Failed to fetch services:', error);
                }
            };

            fetchServices();
        }
    }, [isOpen, client, selectedDate, setValue]);

    const onSubmit = async (data: CreateAppointmentData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create appointment');

            toast.success('Appointment created!');
            reset();
            onClose();
        } catch (error) {
            toast.error('Failed to schedule appointment');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-semibold text-lg text-slate-800">New Appointment</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input
                                {...register('customerPhone')}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="08012345678"
                            />
                            {errors.customerPhone && <p className="text-xs text-red-500 mt-1">{errors.customerPhone.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                            <input
                                {...register('customerName')}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe"
                            />
                            {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>}
                        </div>
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
                        <select
                            {...register('service')}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">Select a service...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.name}>{s.name} ({s.duration})</option>
                            ))}
                            <option value="Consultation">General Consultation</option>
                        </select>
                        {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service.message}</p>}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                            <input
                                type="time"
                                {...register('time')}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                        <textarea
                            {...register('notes')}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {isLoading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
