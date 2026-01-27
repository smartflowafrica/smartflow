'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { getCustomers } from '@/app/actions/customers';

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
    const [customers, setCustomers] = useState<any[]>([]);
    const [isExistingCustomer, setIsExistingCustomer] = useState(true); // Default to selecting existing

    const [formData, setFormData] = useState({
        customerId: '', // Added ID for linking
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
    const [products, setProducts] = useState<any[]>([]);
    const [selectedParts, setSelectedParts] = useState<any[]>([]);

    // Fetch services, products, and customers on mount
    useEffect(() => {
        if (isOpen) {
            Promise.all([
                fetch('/api/services?isActive=true').then(res => res.json()),
                fetch('/api/inventory').then(res => res.json()),
                getCustomers(clientId)
            ]).then(([servicesData, productsData, customersData]) => {
                if (servicesData.services) setServices(servicesData.services);
                if (productsData.products) setProducts(productsData.products);
                if (customersData.success) setCustomers(customersData.data || []);
            }).catch(err => console.error('Failed to fetch data:', err));
        }
    }, [isOpen]);

    // Helper to format currency with commas
    const formatNumber = (value: string) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        if (!numericValue) return '';
        const parts = numericValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    // Helper to strip commas
    const parseNumber = (value: string) => {
        return value.replace(/,/g, '');
    };

    if (!isOpen) return null;

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const service = services.find(s => s.name === selectedId);

        if (service) {
            const total = calculateTotal(service.price, selectedParts);
            setFormData(prev => ({
                ...prev,
                serviceType: selectedId,
                price: formatNumber(total.toString())
            }));
        } else {
            setFormData(prev => ({ ...prev, serviceType: selectedId }));
        }
    };

    const calculateTotal = (basePrice: string | number, parts: any[]) => {
        // Parse basePrice in case it's a formatted string
        const cleanBase = parseNumber(basePrice?.toString() || '0');
        const labor = parseFloat(cleanBase) || 0;
        const partsTotal = parts.reduce((sum, part) => sum + (part.price * part.quantity), 0);
        return labor + partsTotal;
    };

    const addPart = (itemId: string, type: 'PRODUCT' | 'SERVICE' = 'PRODUCT') => {
        let item: any;
        if (type === 'PRODUCT') {
            item = products.find(p => p.id === itemId);
        } else {
            item = services.find(s => s.name === itemId || s.id === itemId);
        }

        if (!item) return;

        // Use name or id as unique key
        const uniqueId = type === 'PRODUCT' ? item.id : (item.id || item.name);

        // Check existing by comparing ID if product, or name if service/other
        const existing = selectedParts.find(p =>
            (type === 'PRODUCT' && p.productId === uniqueId) ||
            (type === 'SERVICE' && p.name === item.name)
        );

        if (existing) {
            // Optional: Auto-increment quantity instead of returning?
            updatePartQuantity(uniqueId, existing.quantity + 1);
            return;
        }

        const newItem = {
            productId: type === 'PRODUCT' ? item.id : undefined,
            id: uniqueId, // Internal tracking ID
            type: type,
            name: item.name,
            price: item.price || 0,
            quantity: 1
        };

        const newParts = [...selectedParts, newItem];
        setSelectedParts(newParts);

        // Update Total
        const currentTotal = parseFloat(parseNumber(formData.price || '0'));
        const newTotal = currentTotal + parseFloat(newItem.price);

        setFormData(prev => ({
            ...prev,
            price: formatNumber(newTotal.toString())
        }));
    };

    const removePart = (id: string) => {
        const part = selectedParts.find(p => p.id === id || p.productId === id);
        const newParts = selectedParts.filter(p => (p.id !== id && p.productId !== id));
        setSelectedParts(newParts);

        if (part) {
            const currentTotal = parseFloat(parseNumber(formData.price || '0'));
            const deduction = part.price * part.quantity;
            const newTotal = Math.max(0, currentTotal - deduction);
            setFormData(prev => ({ ...prev, price: formatNumber(newTotal.toString()) }));
        }
    };

    const updatePartQuantity = (id: string, qty: number) => {
        if (qty < 1) return;

        const oldPart = selectedParts.find(p => p.id === id || p.productId === id);
        if (!oldPart) return;

        const newParts = selectedParts.map(p =>
            (p.id === id || p.productId === id) ? { ...p, quantity: qty } : p
        );
        setSelectedParts(newParts);

        const diff = (qty - oldPart.quantity) * oldPart.price;
        const current = parseFloat(parseNumber(formData.price || '0'));
        const newTotal = current + diff;

        setFormData(prev => ({ ...prev, price: formatNumber(newTotal.toString()) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { createJob } = await import('@/app/actions/jobs');

            // Dynamic Description Construction
            let description = formData.serviceType;
            let metadata: any = {
                serviceType: formData.serviceType
            };

            if (businessType === 'AUTO_MECHANIC') {
                if (formData.vehicleMake) {
                    description = `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel} - ${formData.serviceType}`;
                }
                metadata.vehicle = {
                    make: formData.vehicleMake,
                    model: formData.vehicleModel,
                    year: formData.vehicleYear,
                    plate: formData.licensePlate
                };
            } else if (businessType === 'HOTEL') {
                description = `Room ${formData.vehicleModel || 'Unassigned'} - ${formData.serviceType}`;
                metadata.hotel = {
                    roomType: formData.vehicleMake,
                    roomNumber: formData.vehicleModel,
                    checkIn: formData.vehicleYear,
                    checkOut: formData.licensePlate
                };
            } else if (businessType === 'RESTAURANT') {
                // For Restaurant, description is based on Table + First Item or generic
                const itemsSummary = selectedParts.map(p =>
                    p.quantity > 1 ? `${p.quantity}x ${p.name}` : p.name
                ).join(', ') || 'Order';
                description = `Table ${formData.vehicleModel || 'Walk-in'} - ${itemsSummary}`;
                metadata.restaurant = {
                    tableNumber: formData.vehicleModel,
                    guestCount: formData.vehicleYear
                };
            } else if (businessType === 'RETAIL') {
                const itemsSummary = selectedParts.map(p =>
                    p.quantity > 1 ? `${p.quantity}x ${p.name}` : p.name
                ).join(', ') || 'Sale';
                description = `Order - ${itemsSummary}`;
            }

            // Prepare items
            const items = selectedParts.map(part => ({
                productId: part.productId,
                description: part.name,
                quantity: part.quantity,
                unitPrice: part.price,
                total: part.price * part.quantity
            }));

            const result = await createJob({
                clientId,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                description: description,
                // Parse formatted price back to number
                price: formData.price ? parseFloat(parseNumber(formData.price)) : undefined,
                items: items,
                metadata: metadata,
                notes: formData.notes
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to create job');
            }

            toast.success(`${terminology.job} created successfully!`);
            onClose();
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Customer Information</h3>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setIsExistingCustomer(true)}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${isExistingCustomer ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Registered
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsExistingCustomer(false);
                                        setFormData(prev => ({ ...prev, customerId: '', customerName: '', customerPhone: '' }));
                                    }}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${!isExistingCustomer ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    New / Walk-in
                                </button>
                            </div>
                        </div>

                        {isExistingCustomer ? (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Select Customer
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    value={formData.customerId}
                                    onChange={(e) => {
                                        const c = customers.find(c => c.id === e.target.value);
                                        if (c) {
                                            setFormData(prev => ({
                                                ...prev,
                                                customerId: c.id,
                                                customerName: c.name,
                                                customerPhone: c.phone
                                            }));
                                        } else {
                                            setFormData(prev => ({ ...prev, customerId: '', customerName: '', customerPhone: '' }));
                                        }
                                    }}
                                >
                                    <option value="">Search or Select Customer...</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.phone}) - {c.jobs?.[0]?.count || 0} jobs
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
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
                        )}
                    </div>

                    {/* Vehicle/Room/Table Information based on Business Type */}
                    {businessType === 'AUTO_MECHANIC' && (
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
                    )}

                    {businessType === 'HOTEL' && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Reservation Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Room Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.vehicleMake} // Reuse field for Room Type
                                        onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">Select Room Type...</option>
                                        <option value="Standard">Standard Room</option>
                                        <option value="Deluxe">Deluxe Room</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Room Number (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.vehicleModel} // Reuse field for Room Number
                                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 104"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.vehicleYear} // Reuse field for Check-in
                                        onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.licensePlate} // Reuse field for Check-out
                                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {businessType === 'RESTAURANT' && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Table Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Table Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.vehicleModel} // Reuse field for Table Number
                                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Table 5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Number of Guests
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.vehicleYear} // Reuse field for Guest Count
                                        onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Retail / General - Default to Simple Item Mode */}
                    {businessType === 'RETAIL' && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 text-sm text-slate-600">
                            Create a new order for this customer. Add items below.
                        </div>
                    )}

                    {/* Service Details Header - Adjust based on business type logic if needed, or keep generic */}
                    {/* Hide Single Service Type for Restaurant - Use Items stack instead */}
                    {businessType !== 'RESTAURANT' && (
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
                    )}

                    {/* Price Input - Computed or Manual */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Total Price (₦)
                        </label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => {
                                const formatted = formatNumber(e.target.value);
                                setFormData({ ...formData, price: formatted });
                            }}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Parts & Materials / Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            {businessType === 'RESTAURANT' ? 'Order Items' : 'Parts & Materials'}
                        </h3>
                        <div className="space-y-3 mb-4">
                            {selectedParts.map(part => (
                                <div key={part.id || part.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <div className="font-medium text-slate-800">{part.name}</div>
                                        <div className="text-xs text-slate-500">₦{part.price.toLocaleString()} each</div>
                                        {part.type === 'SERVICE' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">Menu</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-white border border-slate-300 rounded-md">
                                            <button
                                                type="button"
                                                onClick={() => updatePartQuantity(part.id || part.productId, part.quantity - 1)}
                                                className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                                            >-</button>
                                            <span className="px-2 text-sm font-medium">{part.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updatePartQuantity(part.id || part.productId, part.quantity + 1)}
                                                className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                                            >+</button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removePart(part.id || part.productId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <select className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        // For Restaurant, check if value is in services first (assume keys don't clash or use prefix)
                                        // A simple heuristic: if it starts with 'srv_', it's service. But IDs are unpredictable.
                                        // Let's use the OPTGROUP approach or just search both.
                                        const val = e.target.value;
                                        if (val.startsWith('srv_')) {
                                            addPart(val.replace('srv_', ''), 'SERVICE');
                                        } else {
                                            addPart(val, 'PRODUCT');
                                        }
                                        e.target.value = ""; // Reset
                                    }
                                }}
                            >
                                <option value="">+ Add Item...</option>
                                {(businessType === 'RESTAURANT' || businessType === 'RETAIL') && services.length > 0 && (
                                    <optgroup label="Menu Items / Services">
                                        {services.map(s => (
                                            <option key={s.id} value={`srv_${s.id || s.name}`}>
                                                {s.name} - ₦{s.price?.toLocaleString()}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                                <optgroup label="Inventory / Products">
                                    {products.map(p => (
                                        <option key={p.id} value={p.id} disabled={selectedParts.some(sp => sp.productId === p.id)}>
                                            {p.name} (Stock: {p.quantity}) - ₦{p.price.toLocaleString()}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
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
