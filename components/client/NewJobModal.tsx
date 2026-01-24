'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface NewJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    businessType: string;
    terminology: { job: string };
}

export function NewJobModal({ isOpen, onClose, clientId, businessType, terminology }: NewJobModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        licensePlate: '',
        serviceType: '',
        price: '',
        notes: '',
    });

    // Fetch services on mount
    useEffect(() => {
        if (isOpen) {
            fetch('/api/services?isActive=true')
                .then(res => res.json())
                .then(data => {
                    if (data.services) setServices(data.services);
                })
                .catch(err => console.error('Failed to fetch services:', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const service = services.find(s => s.name === selectedId); // Match by name as value

        // If we found a matching service, auto-fill price
        if (service) {
            setFormData(prev => ({
                ...prev,
                serviceType: selectedId,
                price: service.price.toString()
            }));
        } else {
            setFormData(prev => ({ ...prev, serviceType: selectedId }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { createJob } = await import('@/app/actions/jobs');

            // Construct a descriptive title/description
            let description = formData.serviceType;
            if (formData.vehicleMake) {
                description = `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel} - ${formData.serviceType}`;
            }

            const result = await createJob({
                clientId,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                description: description,
                price: formData.price ? parseFloat(formData.price) : undefined,
                // Map business-specific fields to metadata
                metadata: {
                    vehicle: {
                        make: formData.vehicleMake,
                        model: formData.vehicleModel,
                        year: formData.vehicleYear,
                        plate: formData.licensePlate
                    },
                    serviceType: formData.serviceType
                },
                notes: formData.notes
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to create job');
            }

            toast.success(`${terminology.job} created successfully!`);
            onClose();

            // Refresh page to show new job (or we could use a context/listener)
            window.location.reload();
        } catch (error: any) {
            console.error('Error creating job:', error);
            toast.error(error.message || 'Failed to create job');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-slate-900">New {terminology.job}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="08012345678"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Vehicle Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Make *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.vehicleMake}
                                    onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Toyota"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Model *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.vehicleModel}
                                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Camry"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Year
                                </label>
                                <input
                                    type="text"
                                    value={formData.vehicleYear}
                                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="2020"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    License Plate
                                </label>
                                <input
                                    type="text"
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ABC-123-XY"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Service Type *
                                </label>
                                <select
                                    required
                                    value={formData.serviceType}
                                    onChange={handleServiceChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select service...</option>
                                    {services.length > 0 ? (
                                        services.map(s => (
                                            <option key={s.id} value={s.name}>
                                                {s.name} - ₦{s.price?.toLocaleString()}
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            {/* Fallback Options if no services created yet */}
                                            <option value="Oil Change">Oil Change</option>
                                            <option value="Brake Service">Brake Service</option>
                                            <option value="Engine Repair">Engine Repair</option>
                                            <option value="Tire Replacement">Tire Replacement</option>
                                            <option value="Other">Other</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Price (₦)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Additional details about the service..."
                            />
                        </div>
                    </div>

                    <div className="flex bg-gray-50 -mx-6 -mb-6 p-6 justify-end gap-3 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? 'Creating...' : `Create ${terminology.job}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
