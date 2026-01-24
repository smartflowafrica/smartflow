'use client';

import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from 'date-fns';
import { AppointmentCard } from './AppointmentCard';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface CalendarViewProps {
    appointments: any[];
}

export function CalendarView({ appointments }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState<'month' | 'list'>('month');

    // Month Generation Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-50"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
                        <button onClick={today} className="px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 border-l border-r border-slate-200">Today</button>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-50"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
                        <button
                            onClick={() => setView('month')}
                            className={`px-3 py-1 rounded-md transition-all ${view === 'month' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-3 py-1 rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Recent List
                        </button>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm"
                    >
                        + New Appointment
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            {view === 'month' ? (
                <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] min-h-0">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 border-b border-r border-slate-200 bg-slate-50 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}

                    {/* Days */}
                    <div className="col-span-7 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                        {calendarDays.map((day, idx) => {
                            const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), day));
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div
                                    key={day.toISOString()}
                                    onClick={() => handleDayClick(day)}
                                    className={`min-h-[120px] p-2 border-b border-r border-slate-200 relative group transition-colors hover:bg-slate-50 cursor-pointer ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'
                                        }`}
                                >
                                    {/* Date Number */}
                                    <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : !isCurrentMonth ? 'text-slate-400' : 'text-slate-700'
                                        }`}>
                                        {format(day, 'd')}
                                    </div>

                                    {/* Appointments */}
                                    <div className="space-y-1">
                                        {dayAppointments.map(apt => (
                                            <AppointmentCard
                                                key={apt.id}
                                                appointment={apt}
                                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); /* TODO: Open Details */ }}
                                            />
                                        ))}
                                    </div>

                                    {/* Hover Add Button */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">+</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4">
                    {/* List View logic could go here */}
                    <div className="space-y-4">
                        {appointments.map(apt => (
                            <div key={apt.id} className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{apt.customerName}</h3>
                                    <p className="text-sm text-slate-500">{typeof apt.service === 'string' ? apt.service : apt.service?.name} • {format(new Date(apt.date), 'MMM d, yyyy')} at {apt.time}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {appointments.length === 0 && <div className="text-center text-slate-400 py-10">No appointments scheduled</div>}
                    </div>
                </div>
            )}

            {/* Modal */}
            <CreateAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDay || new Date()}
            />
        </div>
    );
}
