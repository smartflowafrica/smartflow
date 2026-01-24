'use client';

import { useRealtimeAppointments } from '@/hooks/useRealtime';
import { CalendarView } from './CalendarView';
import { useClient } from '@/hooks/useClient';

export function ScheduleLayout() {
    const { client } = useClient();
    const { appointments } = useRealtimeAppointments();

    if (!client) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="h-full flex flex-col">
            <CalendarView appointments={appointments} />
        </div>
    );
}
