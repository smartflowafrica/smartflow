'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { ConfirmationModal } from '../../../../components/ui/ConfirmationModal';

interface BusinessSector {
    id: string;
    name: string;
    code: string;
    icon: string;
    color: string;
    config: any;
    _count?: {
        clients: number;
    };
}

export default function SectorsPage() {
    const [sectors, setSectors] = useState<BusinessSector[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSector, setEditingSector] = useState<BusinessSector | null>(null);

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; sector: BusinessSector | null }>({
        isOpen: false,
        sector: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchSectors();
    }, []);

    async function fetchSectors() {
        try {
            const res = await fetch('/api/sectors');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setSectors(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load sectors');
        } finally {
            setIsLoading(false);
        }
    }

    function handleAdd() {
        setEditingSector(null);
        setShowModal(true);
    }

    function handleEdit(sector: BusinessSector) {
        setEditingSector(sector);
        setShowModal(true);
    }

    function handleDelete(sector: BusinessSector) {
        setDeleteModal({ isOpen: true, sector });
    }

    async function confirmDelete() {
        if (!deleteModal.sector) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/sectors?id=${deleteModal.sector.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete');
            }

            toast.success('Sector deleted successfully');
            fetchSectors();
            setDeleteModal({ isOpen: false, sector: null });
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete sector');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Business Sectors</h1>
                    <p className="text-slate-500">Manage business types available for client onboarding.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Sector
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading sectors...</p>
                </div>
            ) : sectors.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Sectors Yet</h3>
                    <p className="text-slate-500 mb-6">Add your first business sector to get started.</p>
                    <button
                        onClick={handleAdd}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Add Sector &rarr;
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Icon</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Code</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Color</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-center">Clients</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sectors.map((sector) => (
                                    <tr key={sector.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <span className="text-3xl">{sector.icon}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{sector.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                {sector.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded border border-slate-200"
                                                    style={{ backgroundColor: sector.color }}
                                                ></div>
                                                <span className="text-slate-600 text-xs">{sector.color}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-slate-700 font-medium">
                                                {sector._count?.clients || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(sector)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sector)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                    disabled={sector._count && sector._count.clients > 0}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <SectorModal
                    sector={editingSector}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchSectors();
                    }}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, sector: null })}
                onConfirm={confirmDelete}
                title="Delete Business Sector?"
                message={
                    <>
                        Are you sure you want to delete <strong className="text-slate-900">{deleteModal.sector?.name}</strong>?
                        <br /><br />
                        <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                            Caution: This breaks existing clients.
                        </span>
                        <br />Ensure no active clients are assigned to this sector before deleting.
                    </>
                }
                confirmText="Delete Sector"
                isLoading={isDeleting}
                variant="danger"
            />
        </div>
    );
}

function SectorModal({
    sector,
    onClose,
    onSuccess
}: {
    sector: BusinessSector | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        name: sector?.name || '',
        code: sector?.code || '',
        icon: sector?.icon || '',
        color: sector?.color || '#3b82f6',
        features: sector?.config?.features?.join(', ') || '',
        customerTerm: sector?.config?.terminology?.customer || '',
        jobTerm: sector?.config?.terminology?.job || '',
        serviceTerm: sector?.config?.terminology?.service || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const config = {
                features: formData.features.split(',').map((f: string) => f.trim()).filter(Boolean),
                terminology: {
                    customer: formData.customerTerm,
                    job: formData.jobTerm,
                    service: formData.serviceTerm
                }
            };

            const payload = {
                id: sector?.id,
                name: formData.name,
                code: formData.code,
                icon: formData.icon,
                color: formData.color,
                config
            };

            const res = await fetch('/api/sectors', {
                method: sector ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(sector ? 'Sector updated successfully' : 'Sector created successfully');
            onSuccess();
        } catch (error) {
            toast.error('Failed to save sector');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">
                        {sector ? 'Edit Sector' : 'Add New Sector'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Sector Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Fitness & Gym"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Code *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., fitness_gym"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Icon (Emoji) *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="🏋️"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Color *
                            </label>
                            <input
                                type="color"
                                required
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Features (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., member_tracking, class_scheduling, equipment_management"
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Terminology</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Customer Term
                                </label>
                                <input
                                    type="text"
                                    value={formData.customerTerm}
                                    onChange={(e) => setFormData({ ...formData, customerTerm: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Member"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Job Term
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobTerm}
                                    onChange={(e) => setFormData({ ...formData, jobTerm: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Session"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Service Term
                                </label>
                                <input
                                    type="text"
                                    value={formData.serviceTerm}
                                    onChange={(e) => setFormData({ ...formData, serviceTerm: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Class"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : sector ? 'Update Sector' : 'Create Sector'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
