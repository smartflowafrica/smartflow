'use client';

import { useEffect, useState } from 'react';
import { getBranches, switchBranch, getCurrentBranchId } from '@/app/actions/branch';
import { Building, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Branch {
    id: string;
    name: string;
}

interface BranchSelectorProps {
    settingsPath?: string;
}

export function BranchSelector({ settingsPath = '/admin/settings/branches' }: BranchSelectorProps) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            try {
                const [branchesRes, currentId] = await Promise.all([
                    getBranches(),
                    getCurrentBranchId()
                ]);

                if (branchesRes.success && branchesRes.data) {
                    setBranches(branchesRes.data);
                }
                setCurrentBranchId(currentId);
            } catch (error) {
                console.error('Failed to load branch data', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const handleSwitch = async (branchId: string | null) => {
        setIsLoading(true);
        await switchBranch(branchId);
        setCurrentBranchId(branchId);
        setIsOpen(false);
        setIsLoading(false);
        router.refresh(); // Refresh server components to reflect changes
    };

    if (isLoading && branches.length === 0) {
        return <div className="animate-pulse h-10 w-full bg-slate-800 rounded-lg"></div>;
    }

    const currentBranchName = currentBranchId
        ? branches.find(b => b.id === currentBranchId)?.name
        : 'All Locations';

    return (
        <div className="relative mb-6 px-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Location
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors text-sm"
            >
                <div className="flex items-center gap-2 truncate">
                    <Building size={16} className="text-blue-400 shrink-0" />
                    <span className="font-medium truncate">{currentBranchName}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto py-1">
                        <button
                            onClick={() => handleSwitch(null)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between group"
                        >
                            <span>All Locations</span>
                            {!currentBranchId && <Check size={14} className="text-blue-400" />}
                        </button>

                        {branches.map(branch => (
                            <button
                                key={branch.id}
                                onClick={() => handleSwitch(branch.id)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between border-t border-slate-700/50"
                            >
                                <span className="truncate">{branch.name}</span>
                                {currentBranchId === branch.id && <Check size={14} className="text-blue-400" />}
                            </button>
                        ))}

                        {branches.length === 0 && (
                            <div className="px-3 py-2 text-xs text-slate-500 text-center">
                                No branches found
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-700 bg-slate-800/50">
                        <Link
                            href={settingsPath}
                            className="block w-full text-center text-xs text-blue-400 hover:text-blue-300 py-1"
                        >
                            Manage Locations
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
