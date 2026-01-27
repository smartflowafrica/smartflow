'use client';

import { useState } from 'react';
import { X, Check, AlertTriangle, XCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

interface InspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    onSuccess: () => void;
}

const CATEGORIES = [
    {
        name: 'Engine & Under Hood',
        items: ['Engine Oil Level/Condition', 'Belts & Tensioners', 'Coolant Hoses', 'Fluid Leaks', 'Battery & Cables']
    },
    {
        name: 'Under Vehicle',
        items: ['Exhaust System', 'Suspension Components', 'Steering Linkage', 'Frame/Chassis', 'Brake Lines']
    },
    {
        name: 'Wheels & Brakes',
        items: ['Tyre Tread Depth', 'Tyre Pressure', 'Brake Pads/Shoes', 'Brake Rotors/Drums']
    },
    {
        name: 'Electrical & Interior',
        items: ['Dashboard Warning Lights', 'Headlights/Tail Lights', 'Wipers/Washers', 'Horn', 'AC/Heater']
    }
];

export function InspectionModal({ isOpen, onClose, jobId, onSuccess }: InspectionModalProps) {
    const [items, setItems] = useState<Record<string, 'GOOD' | 'FAIR' | 'BAD'>>({});
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleStatus = (itemName: string, status: 'GOOD' | 'FAIR' | 'BAD') => {
        setItems(prev => ({ ...prev, [itemName]: status }));
    };

    const getStatusColor = (current: string | undefined, target: string) => {
        if (current === target) {
            if (target === 'GOOD') return 'bg-green-100 text-green-700 border-green-300';
            if (target === 'FAIR') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            if (target === 'BAD') return 'bg-red-100 text-red-700 border-red-300';
        }
        return 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100';
    };

    const handleSubmit = async () => {
        // Validate that all items are checked? Or allow partial?
        // Let's allow partial for flexibility, but maybe warn?
        // For now, strict: count items
        const totalItems = CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
        const checkedItems = Object.keys(items).length;

        if (checkedItems < totalItems) {
            if (!confirm(`You have only checked ${checkedItems}/${totalItems} items. Submit anyway?`)) return;
        }

        setIsSubmitting(true);
        try {
            // Format data for backend
            const formattedItems = Object.entries(items).map(([name, status]) => {
                // Find category
                const cat = CATEGORIES.find(c => c.items.includes(name));
                return {
                    category: cat?.name || 'General',
                    name,
                    status,
                    note: '' // Input for per-item note could be added later
                };
            });

            const payload = {
                items: formattedItems,
                notes
            };

            const res = await fetch(`/api/jobs/${jobId}/inspection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to submit inspection');

            toast.success('Inspection Report generated & sent!');
            onSuccess();
            onClose();

        } catch (error) {
            console.error(error);
            toast.error('Failed to submit inspection');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Vehicle Inspection Checklist</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {CATEGORIES.map(category => (
                        <div key={category.name}>
                            <h3 className="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100">{category.name}</h3>
                            <div className="space-y-3">
                                {category.items.map(item => (
                                    <div key={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                                        <span className="font-medium text-slate-700">{item}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatus(item, 'GOOD')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${getStatusColor(items[item], 'GOOD')}`}
                                            >
                                                <Check size={16} /> Good
                                            </button>
                                            <button
                                                onClick={() => handleStatus(item, 'FAIR')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${getStatusColor(items[item], 'FAIR')}`}
                                            >
                                                <AlertTriangle size={16} /> Fair
                                            </button>
                                            <button
                                                onClick={() => handleStatus(item, 'BAD')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${getStatusColor(items[item], 'BAD')}`}
                                            >
                                                <XCircle size={16} /> Bad
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div>
                        <label className="block font-bold text-slate-800 mb-2">Mechanic Recommendations / Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Brake pads are wearing thin, recommend replacement within 1,000km..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Complete & Send Report
                    </button>
                </div>
            </div>
        </div>
    );
}
