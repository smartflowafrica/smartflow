'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Search, Edit2, Trash2, Tag, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
    id: string;
    name: string;
    description: string;
    price?: number;
    commitmentFee?: number; // New Field  
    duration: number; // in minutes
    category: string;
    active: boolean;
    metadata?: any;
    pricingRules?: { location: string; price: number }[];
}

export default function ServicesPage() {
    const { data: session } = useSession();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // State for Images
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Initialize images when editing
    // Initialize images
    useEffect(() => {
        if (editingService?.metadata?.images) {
            setImages(editingService.metadata.images);
        } else {
            setImages([]);
        }
    }, [editingService, isModalOpen]);

    const [error, setError] = useState('');

    // Controlled Inputs State
    const [priceDisplay, setPriceDisplay] = useState('');
    const [feeDisplay, setFeeDisplay] = useState('');
    const [pricingRules, setPricingRules] = useState<{ location: string; price: string }[]>([]);

    useEffect(() => {
        if (isModalOpen) {
            setPriceDisplay(editingService?.price ? Number(editingService.price).toLocaleString() : '');
            setFeeDisplay(editingService?.commitmentFee ? Number(editingService.commitmentFee).toLocaleString() : '');

            if (editingService?.pricingRules && Array.isArray(editingService.pricingRules)) {
                setPricingRules(editingService.pricingRules as any);
            } else {
                setPricingRules([]);
            }
        }
    }, [editingService, isModalOpen]);

    const formatCurrencyInput = (value: string) => {
        // Remove non-digits
        const number = value.replace(/[^0-9]/g, '');
        if (!number) return '';
        return Number(number).toLocaleString();
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        setter(formatCurrencyInput(e.target.value));
    };

    const addPricingRule = () => {
        setPricingRules([...pricingRules, { location: '', price: '' }]);
    };

    const removePricingRule = (index: number) => {
        setPricingRules(rules => rules.filter((_, i) => i !== index));
    };

    const updatePricingRule = (index: number, field: 'location' | 'price', value: string) => {
        setPricingRules(rules => {
            const newRules = [...rules];
            newRules[index] = { ...newRules[index], [field]: value };
            return newRules;
        });
    };

    // Fetch Services
    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            if (!res.ok) throw new Error('Failed to fetch services');
            const data = await res.json();
            setServices(data.services || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load services');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Upload failed');
                const data = await res.json();
                return data.url;
            });

            const newUrls = await Promise.all(uploadPromises);
            const fullUrls = newUrls.map(url => `${window.location.origin}${url}`);
            setImages(prev => [...prev, ...fullUrls]);

        } catch (error) {
            toast.error('Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const metadata = images.length > 0 ? { images } : undefined;
        const postToStatus = formData.get('postToStatus') === 'on';

        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price') ? parseFloat((formData.get('price') as string).replace(/,/g, '')) : undefined,
            commitmentFee: formData.get('commitmentFee') ? parseFloat((formData.get('commitmentFee') as string).replace(/,/g, '')) : undefined,
            duration: parseInt(formData.get('duration') as string),
            category: formData.get('category'),
            metadata,
            postToStatus, // New Field
            pricingRules: pricingRules.filter(r => r.location && r.price).map(r => ({ location: r.location, price: parseFloat(r.price.replace(/,/g, '')) })),
            isActive: true
        };

        try {
            const url = editingService
                ? `/api/services/${editingService.id}`
                : '/api/services';

            const method = editingService ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to save service');

            toast.success(editingService ? 'Service updated' : 'Service created');
            setIsModalOpen(false);
            setEditingService(null);
            fetchServices();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save service');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success('Service deleted');
            fetchServices();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Services & Pricing</h1>
                    <p className="text-slate-500">Manage your service offerings and prices</p>
                </div>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add New Service
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>

            {/* Services List */}
            {isLoading ? (
                <div className="text-center py-12 text-slate-500">Loading services...</div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No services found. Add your first service!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <div key={service.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md uppercase tracking-wide">
                                    {service.category || 'General'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingService(service);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 mb-1">{service.name}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">
                                {service.description || 'No description provided'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                    <Clock size={16} />
                                    <span>{service.duration} mins</span>
                                </div>
                                <div className="font-bold text-slate-900 text-lg">
                                    {service.price ? '₦' + Number(service.price).toLocaleString() : 'Price Varies'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="font-bold text-lg">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                                <input
                                    name="name"
                                    defaultValue={editingService?.name}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Oil Change"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₦) <span className="text-slate-400 font-normal">(Leave empty for text-based/location pricing)</span></label>
                                    <input
                                        name="price"
                                        type="text"
                                        value={priceDisplay}
                                        onChange={(e) => handlePriceChange(e, setPriceDisplay)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Commitment Fee (Optional)</label>
                                    <input
                                        name="commitmentFee"
                                        type="text"
                                        value={feeDisplay}
                                        onChange={(e) => handlePriceChange(e, setFeeDisplay)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (mins)</label>
                                    <input
                                        name="duration"
                                        type="number"
                                        defaultValue={editingService?.duration || 30}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    defaultValue={editingService?.category || 'General'}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="General">General</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingService?.description}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                    placeholder="Describe what's included..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Images</label>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((url, i) => (
                                            <div key={i} className="relative group w-20 h-20 border rounded-lg overflow-hidden bg-slate-100">
                                                <img src={url} alt="Product" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(i)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                            {isUploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" /> : <Plus size={24} className="text-slate-400" />}
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-400">Upload multiple images. They will be sent as an album.</p>
                                </div>
                                {images.length > 0 && (
                                    null
                                )}
                            </div>

                            {/* Dynamic Pricing Rules */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location-Based Pricing (Optional)</label>
                                <div className="space-y-2">
                                    {pricingRules.map((rule, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <input
                                                placeholder="Location (e.g. Lekki)"
                                                value={rule.location}
                                                onChange={(e) => updatePricingRule(index, 'location', e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={rule.price}
                                                onChange={(e) => updatePricingRule(index, 'price', e.target.value)}
                                                className="w-24 px-3 py-2 border rounded-lg text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePricingRule(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addPricingRule}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Location Price
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Save Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
