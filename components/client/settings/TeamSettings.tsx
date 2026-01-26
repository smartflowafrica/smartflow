'use client';

import { useState, useEffect } from 'react';
import { useClient } from '@/hooks/useClient';
import { toast } from 'sonner';
import { Plus, Trash2, Users, Shield, Mail, Lock, User } from 'lucide-react';
import { createStaffUser, deleteStaffUser, updateClientTeam } from '@/app/actions/client-settings';
import { getTeamMembers } from '@/app/actions/client';

export function TeamSettings() {
    const { client } = useClient();
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'AGENT' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadTeam();
    }, [client]);

    const loadTeam = async () => {
        if (!client) return;
        setLoading(true);
        try {
            const res = await getTeamMembers(client.id);
            if (res.success && res.data) {
                setTeamMembers(res.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!client || !formData.email || !formData.password) return;
        setIsSaving(true);
        try {
            const res = await createStaffUser(client.id, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role as any
            });

            if (res.success) {
                toast.success('Staff member invited successfully');
                setIsAddOpen(false);
                setFormData({ name: '', email: '', password: '', role: 'AGENT' });
                loadTeam();
            } else {
                toast.error(res.error || 'Failed to create user');
            }
        } catch (e) {
            toast.error('Error creating user');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, type: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;

        try {
            if (type === 'USER') {
                const res = await deleteStaffUser(id);
                if (res.success) {
                    toast.success('User removed');
                    loadTeam();
                } else {
                    toast.error(res.error || 'Failed to remove');
                }
            } else {
                // Handle legacy manual removal if needed (ignoring for now as we move to real users)
                toast.info('Please verify legacy staff via Database');
            }
        } catch (e) {
            toast.error('Removal failed');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Users className="text-blue-600" size={20} />
                        Staff & Permissions
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Create accounts for your team members.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Add Member
                </button>
            </div>

            {/* Add Member Form (Inline or Modal - Inline for simplicity here if open) */}
            {isAddOpen && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                placeholder="Initial password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Role</label>
                            <select
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="AGENT">Agent (Chat & Calendar)</option>
                                <option value="MANAGER">Manager (Full Access)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setIsAddOpen(false)}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSaving ? 'Inviting...' : 'Send Invitation'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-4 text-slate-400">Loading team...</div>
                ) : (
                    teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:border-blue-100 transition shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{member.name} {member.displayRole === 'OWNER' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Owner</span>}</h4>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5">
                                        <div className="flex items-center gap-1"><Mail size={12} /> {member.email || 'No email'}</div>
                                        <div className="flex items-center gap-1"><Shield size={12} /> {member.displayRole}</div>
                                    </div>
                                </div>
                            </div>

                            {member.displayRole !== 'OWNER' && (
                                <button
                                    onClick={() => handleDelete(member.id, member.type)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Remove User"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
