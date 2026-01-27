'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, User, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { AppointmentModal } from '@/components/client/AppointmentModal';
import { useClient } from '@/hooks/useClient';
import { getBusinessTypeConfig } from '@/lib/config/business-types';

export default function AppointmentsPage() {
    const { client } = useClient();
    const config = client ? getBusinessTypeConfig(client.businessType) : null;
    const isReservation = client?.businessType === 'RESTAURANT' || client?.businessType === 'HOTEL';

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const loadAppointments = async () => {
        try {
            // Helper to get cookie value by name
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
            }

            const branchId = getCookie('sf_branch_id');
            const query = branchId ? `?branchId=${branchId}` : '';

            const res = await fetch(`/api/booking/appointments${query}`);
            const data = await res.json();

            if (Array.isArray(data)) setAppointments(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load appointments');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
        loadAppointments(); // Refresh list after close
    };

    const handleReschedule = (apt: any) => {
        setSelectedAppointment(apt);
        setIsModalOpen(true);
    };

    const formatTime12 = (timeStr: string) => {
        if (!timeStr) return '';
        // If already has am/pm, return as is (legacy support)
        if (timeStr.toLowerCase().includes('m')) return timeStr;

        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    if (loading) return <div className="p-6">Loading appointments...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                appointment={selectedAppointment}
                terminology={config?.terminology}
                isReservation={isReservation}
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                    {config?.terminology.calendarLabel || 'Appointments'}
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={18} />
                    {isReservation ? 'New Reservation' : 'New Appointment'}
                </button>
            </div>

            <div className="grid gap-4">
                {appointments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500">No appointments scheduled.</p>
                    </div>
                ) : (
                    appointments.map(apt => (
                        <div key={apt.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-center min-w-[80px]">
                                    <div className="text-xs text-blue-600 font-bold uppercase">
                                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    <div className="text-xl font-bold text-slate-900">
                                        {new Date(apt.date).getDate()}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        {apt.service?.name || 'Service'}
                                        <span className={`px-2 py-0.5 rounded text-xs lowercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {formatTime12(apt.time) || new Date(apt.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                            {apt.duration && ` (${apt.duration}m)`}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {apt.customerName}
                                        </span>
                                    </div>
                                    {apt.notes && (
                                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                            <FileText size={12} /> {apt.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleReschedule(apt)}
                                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded border border-slate-200"
                                >
                                    Reschedule
                                </button>
                                <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded border border-slate-200">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
