'use client';

import { useState } from 'react';
import { Plus, Download, Tag } from 'lucide-react';

interface Service {
    name: string;
    description: string;
    price: string;
    category: string;
}

interface ClientServicesSetupProps {
    defaultServices?: Service[];
    onSubmit: (services: Service[]) => void;
}

export function ClientServicesSetup({ defaultServices, onSubmit }: ClientServicesSetupProps) {
    const [services, setServices] = useState<Service[]>(defaultServices || []);
    const [newService, setNewService] = useState<Service>({ name: '', description: '', price: '', category: '' });

    const addService = () => {
        if (!newService.name || !newService.price) return;
        setServices([...services, newService]);
        setNewService({ name: '', description: '', price: '', category: '' });
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Tag className="text-purple-600" />
                    Service Catalog
                </h2>
                <p className="text-sm text-slate-500 mb-6">Build your menu of services. You can also import standard templates.</p>

                {/* Add Form */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <div className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-4">
                            <input
                                placeholder="Service Name *"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                                placeholder="Category"
                                value={newService.category}
                                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                                type="number"
                                placeholder="Price *"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <button
                                onClick={addService}
                                disabled={!newService.name || !newService.price}
                                className="w-full bg-blue-600 text-white h-[38px] rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <textarea
                        placeholder="Description (Optional)"
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none"
                    />
                </div>

                {/* List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {services.map((service, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 group">
                            <div>
                                <h4 className="font-semibold text-slate-800">{service.name}</h4>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mr-2">{service.category || 'General'}</span>
                                <span className="text-xs text-slate-500">₦{Number(service.price).toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => removeService(idx)}
                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div className="text-center py-8 text-slate-400 italic bg-white border border-dashed rounded-lg">
                            No services added yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Trigger */}
            <div id="step-submit-trigger" onClick={() => onSubmit(services)} style={{ display: 'none' }} />
        </div>
    );
}
