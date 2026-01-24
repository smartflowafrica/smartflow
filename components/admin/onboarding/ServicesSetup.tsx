'use client';

import { useState } from 'react';
import { getBusinessTypeConfig } from '@/lib/config/business-types';

interface Service {
    name: string;
    priceMin: number;
    priceMax?: number;
}

interface ServicesSetupProps {
    businessType: string;
    defaultServices?: Service[];
    onSubmit: (services: Service[]) => void;
}

export function ServicesSetup({ businessType, defaultServices, onSubmit }: ServicesSetupProps) {
    const config = getBusinessTypeConfig(businessType);
    const [services, setServices] = useState<Service[]>(
        defaultServices ||
        config.defaultServices.map(name => ({ name, priceMin: 0 }))
    );

    const addService = () => {
        setServices([...services, { name: '', priceMin: 0 }]);
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const updateService = (index: number, field: keyof Service, value: any) => {
        setServices(services.map((s, i) =>
            i === index ? { ...s, [field]: value } : s
        ));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Services Setup</h2>
                <p className="text-sm text-slate-500">Configure the default services offered by this business.</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {services.map((service, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-slate-50">
                        <div className="flex-1 space-y-2">
                            <input
                                value={service.name}
                                onChange={(e) => updateService(index, 'name', e.target.value)}
                                placeholder="Service Name"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="w-32 space-y-2">
                            <input
                                type="number"
                                value={service.priceMin || ''}
                                onChange={(e) => updateService(index, 'priceMin', parseInt(e.target.value))}
                                placeholder="Price"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <button
                            onClick={() => removeService(index)}
                            className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addService}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
                + Add Another Service
            </button>

            {/* Hidden submit trigger handled by parent wizard */}
            <div id="step-submit-trigger" onClick={() => onSubmit(services)} style={{ display: 'none' }} />
        </div>
    );
}
