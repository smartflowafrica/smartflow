import { Edit2, Clock, Tag, MoreHorizontal, Power, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration?: number;
    category?: string;
    isActive: boolean;
    metadata?: any;
}

interface ServiceCardProps {
    service: Service;
    onEdit: (service: Service) => void;
    onToggleActive: (serviceId: string, isActive: boolean) => void;
    sectorConfig?: {
        icon: string;
        color: string;
        terminology: { services: string };
    };
}

export function ServiceCard({ service, onEdit, onToggleActive, sectorConfig }: ServiceCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Default color if sector config is missing
    const themeColor = sectorConfig?.color || '#3B82F6';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div
            className={`
                relative bg-white rounded-xl border transition-all duration-300 overflow-hidden
                ${service.isActive
                    ? 'border-slate-200 hover:shadow-lg hover:border-blue-300'
                    : 'border-slate-100 bg-slate-50 opacity-75'
                }
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status Strip */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-colors"
                style={{ backgroundColor: service.isActive ? themeColor : '#CBD5E1' }}
            />

            <div className="p-5 pl-7">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className={`font-semibold text-lg line-clamp-1 ${service.isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                            {service.name}
                        </h3>
                        {service.category && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-1">
                                <Tag size={10} />
                                {service.category}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Status Toggle */}
                        <button
                            onClick={() => onToggleActive(service.id, !service.isActive)}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                                ${service.isActive ? 'bg-green-500' : 'bg-slate-300'}
                            `}
                            title={service.isActive ? "Deactivate Service" : "Activate Service"}
                        >
                            <span
                                className={`
                                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                    ${service.isActive ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem] mb-4">
                    {service.description || 'No description provided.'}
                </p>

                {/* Footer / Stats */}
                <div className="flex items-end justify-between border-t border-slate-100 pt-4 mt-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</span>
                        <span
                            className="text-lg font-bold"
                            style={{ color: service.isActive ? '#166534' : '#64748B' }}
                        >
                            {formatCurrency(Number(service.price))}
                        </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        {service.duration && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                <Clock size={14} />
                                <span>{service.duration} mins</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata Area (Conditional) */}
                {service.metadata && Object.keys(service.metadata).length > 0 && (
                    <div className="mt-3 pt-2 border-t border-dashed border-slate-200 text-xs text-slate-500">
                        {Object.entries(service.metadata).slice(0, 2).map(([key, value]) => (
                            <span key={key} className="mr-3 inline-block">
                                <span className="font-medium capitalize">{key}:</span> {String(value)}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Actions Overlay */}
            <div className={`
                absolute top-2 right-14 flex items-center gap-2 transition-opacity duration-200
                ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
                <button
                    onClick={() => onEdit(service)}
                    className="p-1.5 bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg shadow-sm transition-all"
                    title="Edit Service"
                >
                    <Edit2 size={16} />
                </button>
            </div>
        </div>
    );
}
