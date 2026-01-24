import { format } from 'date-fns';

interface AppointmentCardProps {
    appointment: {
        id: string;
        customerName: string;
        service: string | { name: string };
        time: string;
        date: string; // ISO string
        status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    };
    onClick?: (e: React.MouseEvent) => void;
}

const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
    CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
    CANCELLED: 'bg-red-50 text-red-500 border-red-100 line-through opacity-75',
    NO_SHOW: 'bg-yellow-50 text-yellow-600 border-yellow-200',
};

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
    const serviceName = typeof appointment.service === 'string' ? appointment.service : appointment.service?.name;

    return (
        <div
            onClick={onClick}
            className={`p-2 rounded-md border text-xs mb-1 cursor-pointer transition-colors hover:opacity-80 ${statusColors[appointment.status] || statusColors.SCHEDULED}`}
        >
            <div className="font-semibold truncate">{appointment.customerName}</div>
            <div className="truncate opacity-90">{serviceName}</div>
            <div className="mt-1 font-mono opacity-75">
                {appointment.time}
            </div>
        </div>
    );
}
