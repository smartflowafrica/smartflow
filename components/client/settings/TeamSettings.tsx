'use client';

import { useState, useEffect } from 'react';
import { useClient } from '@/hooks/useClient';
import { toast } from 'sonner';
import { Plus, Trash2, Users, UserPlus } from 'lucide-react';
import { updateClientTeam } from '@/app/actions/client-settings';

export function TeamSettings() {
    const { client } = useClient();
    // Initialize with existing metadata team or empty array
    // We assume client.metadata.whatsappConfig.teamMembers exists from the previous steps
    const [teamMembers, setTeamMembers] = useState<string[]>(
        (client?.metadata as any)?.whatsappConfig?.teamMembers || []
    );
    const [newMemberName, setNewMemberName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = () => {
        if (!newMemberName.trim()) return;
        setTeamMembers([...teamMembers, newMemberName.trim()]);
        setNewMemberName('');
    };

    const handleRemove = (index: number) => {
        setTeamMembers(teamMembers.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!client) return;
        setIsSaving(true);
        try {
            // We are only updating the metadata part for now
            const result = await updateClientTeam(client.id, teamMembers);
            if (result.success) {
                toast.success('Team list updated');
            } else {
                toast.error('Failed to update team');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="text-blue-600" size={20} />
                Staff Management
            </h2>
            <p className="text-sm text-slate-500 mb-6">
                Manage the list of staff members who handle customer inquiries.
                These names will appear in your Team Inbox.
            </p>

            <div className="max-w-md space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="Enter staff name (e.g. Mike)"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newMemberName.trim()}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="space-y-2">
                    {teamMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                            <span className="font-medium text-slate-700">{member}</span>
                            <button
                                onClick={() => handleRemove(idx)}
                                className="text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {teamMembers.length === 0 && (
                        <p className="text-center text-sm text-slate-400 py-4 italic">No staff members added yet.</p>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900 text-sm">Need separate logins?</h3>
                        <p className="text-xs text-blue-700 mt-1">
                            Currently, these staff members do not have login access.
                            Multi-user login access is coming soon to the Enterprise plan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
