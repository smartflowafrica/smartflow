'use client';

import { useState, useEffect } from 'react';
import { useClient } from '@/hooks/useClient';
import { JobList } from '@/components/client/jobs/JobList';
import { JobKanbanBoard } from '@/components/client/jobs/JobKanbanBoard';
import { NewJobModal } from '@/components/client/NewJobModal';
import { useBusinessType } from '@/hooks/useBusinessType';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { getClientJobs } from '@/app/actions/jobs';

export default function JobsPage() {
    const { client } = useClient();
    const { getTerminology } = useBusinessType(client?.businessType);
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
    const [isNewJobOpen, setIsNewJobOpen] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const jobsTerm = getTerminology('jobs') || 'Jobs';
    const jobTerm = getTerminology('job') || 'Job';

    useEffect(() => {
        async function fetchJobs() {
            if (!client?.id) return;
            try {
                const result = await getClientJobs(client.id);
                if (result.success && result.data) {
                    setJobs(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchJobs();
    }, [client]);

    if (!client) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{jobsTerm} Management</h1>
                    <p className="text-slate-500">Track and manage your customer {jobsTerm.toLowerCase()}</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'kanban'
                            ? 'bg-white shadow text-blue-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                        title="Kanban Board"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                            ? 'bg-white shadow text-blue-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                        title="List View"
                    >
                        <List size={20} />
                    </button>
                </div>

                <button
                    onClick={() => setIsNewJobOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    New {jobTerm}
                </button>
            </div>

            <div className="flex-1 overflow-hidden min-h-[600px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {viewMode === 'kanban' ? (
                            <div className="h-full overflow-hidden">
                                <JobKanbanBoard initialJobs={jobs} businessType={client.businessType} />
                            </div>
                        ) : (
                            <JobList jobs={jobs} />
                        )}
                    </>
                )}
            </div>

            <NewJobModal
                isOpen={isNewJobOpen}
                onClose={() => setIsNewJobOpen(false)}
                clientId={client.id}
                businessType={client.businessType}
                terminology={{ job: jobTerm }}
            />
        </div>
    );
}
