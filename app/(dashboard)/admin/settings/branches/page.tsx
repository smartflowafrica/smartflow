'use client';

import { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { createBranch, getBranches } from '@/app/actions/branch';
import { useRouter } from 'next/navigation';

interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    isActive: boolean;
    _count?: {
        users: number;
        jobs: number;
    }
}

export default function BranchSettingsPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        managerId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setIsLoading(true);
        const res = await getBranches();
        if (res.success && res.data) {
            setBranches(res.data as Branch[]);
        } else {
            toast.error('Failed to load branches');
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const res = await createBranch({
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            // managerId: formData.managerId || undefined
        });

        if (res.success) {
            toast.success('Branch created successfully');
            setIsCreateModalOpen(false);
            setFormData({ name: '', address: '', phone: '', managerId: '' });
            loadBranches(); // Reload list
            router.refresh(); // Update server components (like sidebar)
        } else {
            toast.error(res.error || 'Failed to create branch');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Branch Management</h1>
                    <p className="text-slate-500">Manage your business locations and outlets.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Branch
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : branches.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No Branches Yet</h3>
                    <p className="text-slate-500 mb-6">Create your first branch to start managing multiple locations.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Create Branch
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch: Branch) => (
                        <div key={branch.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Building className="text-blue-600" size={24} />
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${branch.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {branch.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">{branch.name}</h3>

                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-start gap-2">
                                    <MapPin size={16} className="mt-0.5 shrink-0" />
                                    <span>{branch.address}</span>
                                </div>
                                {branch.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>{branch.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                                <button className="text-slate-600 hover:text-blue-600 font-medium">Edit Details</button>
                                <button className="text-slate-600 hover:text-blue-600 font-medium">View Stats</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add New Branch</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Downtown Office"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    placeholder="Full physical address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="+234..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Branch'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
