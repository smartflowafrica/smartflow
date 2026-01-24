'use client';

import { useState } from 'react';
import { Clock, MapPin, Truck } from 'lucide-react';

interface BusinessConfig {
    hours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    address: string;
    locationCoordinates?: { lat: number; lng: number };
    deliveryOptions: {
        pickup: boolean;
        delivery: boolean;
        deliveryRadiusKm?: number;
    };
}

interface BusinessConfigFormProps {
    defaultValues?: Partial<BusinessConfig>;
    onSubmit: (config: BusinessConfig) => void;
}

export function BusinessConfigForm({ defaultValues, onSubmit }: BusinessConfigFormProps) {
    const [config, setConfig] = useState<BusinessConfig>({
        hours: defaultValues?.hours || {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: 'Closed',
            sunday: 'Closed',
        },
        address: defaultValues?.address || '',
        deliveryOptions: defaultValues?.deliveryOptions || {
            pickup: true,
            delivery: false,
        }
    });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="text-blue-600" />
                    Business Hours
                </h2>
                <p className="text-sm text-slate-500 mb-4">Set your operating hours for customers to see.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {days.map(day => (
                        <div key={day} className="flex items-center justify-between">
                            <span className="capitalize w-24 font-medium text-slate-700">{day}</span>
                            <input
                                type="text"
                                value={(config.hours as any)[day]}
                                onChange={(e) => setConfig({
                                    ...config,
                                    hours: { ...config.hours, [day]: e.target.value }
                                })}
                                className="px-3 py-1.5 border rounded-lg text-sm w-48 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 9am-5pm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Location section removed to avoid duplication with Step 1 */}

            <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Truck className="text-green-600" />
                    Delivery & Pickup
                </h2>
                <div className="flex gap-6 mt-4">
                    <label className="flex items-center gap-2 cursor-pointer p-4 border rounded-xl hover:bg-slate-50 transition w-full">
                        <input
                            type="checkbox"
                            checked={config.deliveryOptions.pickup}
                            onChange={(e) => setConfig({
                                ...config,
                                deliveryOptions: { ...config.deliveryOptions, pickup: e.target.checked }
                            })}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <div>
                            <span className="font-semibold block">Pickup Available</span>
                            <span className="text-xs text-slate-500">Customers can visit store</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-4 border rounded-xl hover:bg-slate-50 transition w-full">
                        <input
                            type="checkbox"
                            checked={config.deliveryOptions.delivery}
                            onChange={(e) => setConfig({
                                ...config,
                                deliveryOptions: { ...config.deliveryOptions, delivery: e.target.checked }
                            })}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <div>
                            <span className="font-semibold block">Delivery Available</span>
                            <span className="text-xs text-slate-500">We ship to customers</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Hidden Trigger */}
            <div id="step-submit-trigger" onClick={() => onSubmit(config)} style={{ display: 'none' }} />
        </div>
    );
}
