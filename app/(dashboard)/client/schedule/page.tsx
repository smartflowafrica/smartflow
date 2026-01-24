import { ScheduleLayout } from '@/components/client/schedule/ScheduleLayout';

export default function SchedulePage() {
    return (
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
                    <p className="text-slate-500">Manage appointments and bookings</p>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ScheduleLayout />
            </div>
        </div>
    );
}
