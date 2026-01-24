'use client';

import { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Badge } from 'lucide-react';
import { JobCard } from '@/components/client/JobCard';
import { updateJobStatus } from '@/app/actions/jobs';
import { toast } from 'sonner';
import { getBusinessTypeConfig } from '@/lib/config/business-types';

// Props
interface Job {
    id: string;
    clientId: string;
    customerName: string;
    description: string;
    status: string; // PENDING, IN_PROGRESS, READY, COMPLETED
    priority: string;
    price?: number;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    customerPhone: string;
    metadata?: any;
}

interface KanbanBoardProps {
    initialJobs: Job[];
    businessType?: string;
}

export function JobKanbanBoard({ initialJobs, businessType = 'AUTO_MECHANIC' }: KanbanBoardProps) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Get columns from business type config
    const config = getBusinessTypeConfig(businessType);
    const columns = config.statusStages.map(stage => ({
        id: stage.value,
        title: stage.label,
        color: `bg-opacity-10 border-opacity-30`,
        colorStyle: stage.color,
    }));

    // Updates state from prop changes (realtime)
    useEffect(() => {
        setJobs(initialJobs);
    }, [initialJobs]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeJob = jobs.find(j => j.id === active.id);
        const overColumnId = over.id as string; // We assume dropping ON the column container

        if (activeJob && activeJob.status !== overColumnId) {
            // Optimistic update
            const oldStatus = activeJob.status;
            setJobs(prev => prev.map(job =>
                job.id === activeJob.id ? { ...job, status: overColumnId } : job
            ));

            try {
                const result = await updateJobStatus(activeJob.id, overColumnId);
                if (!result.success) {
                    throw new Error(result.error);
                }
                toast.success(`Job moved to ${overColumnId.replace('_', ' ')}`);
            } catch (error) {
                // Revert
                setJobs(prev => prev.map(job =>
                    job.id === activeJob.id ? { ...job, status: oldStatus } : job
                ));
                toast.error('Failed to update status');
            }
        }
    };

    // Split columns into two rows for better visibility
    const halfIndex = Math.ceil(columns.length / 2);
    const topRow = columns.slice(0, halfIndex);
    const bottomRow = columns.slice(halfIndex);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            // onDragOver={handleDragOver} // Optional for sophisticated sortable
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col gap-4 h-full overflow-auto pb-4">
                {/* Top Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {topRow.map(col => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            color={col.color}
                            colorStyle={col.colorStyle}
                            jobs={jobs.filter(j => j.status === col.id)}
                            businessType={businessType}
                        />
                    ))}
                </div>

                {/* Bottom Row */}
                {bottomRow.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bottomRow.map(col => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                color={col.color}
                                colorStyle={col.colorStyle}
                                jobs={jobs.filter(j => j.status === col.id)}
                                businessType={businessType}
                            />
                        ))}
                    </div>
                )}
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="opacity-80 rotate-2 scale-105">
                        <JobCard
                            job={{
                                ...jobs.find(j => j.id === activeId)!,
                                createdAt: jobs.find(j => j.id === activeId)!.createdAt.toISOString(),
                                updatedAt: jobs.find(j => j.id === activeId)!.updatedAt.toISOString(),
                            }}
                            // Pass stub handlers for overlay
                            businessType="mechanic"
                            onStatusUpdate={async () => { }}
                            onMarkReady={async () => { }}
                            onNotifyCustomer={async () => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function KanbanColumn({ id, title, color, colorStyle, jobs, businessType }: { id: string, title: string, color: string, colorStyle?: string, jobs: Job[], businessType: string }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col h-full min-h-[500px] min-w-[260px] rounded-xl border ${color} p-4 transition-colors`}
            style={{
                backgroundColor: colorStyle ? `${colorStyle}15` : undefined,
                borderColor: colorStyle ? `${colorStyle}40` : undefined
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colorStyle || '#6B7280' }}
                    />
                    <h3 className="font-semibold text-slate-700">{title}</h3>
                </div>
                <span className="px-2 py-0.5 bg-white text-slate-500 text-xs rounded-full border border-slate-200">
                    {jobs.length}
                </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {jobs.map(job => (
                    <DraggableJobCard key={job.id} job={job} businessType={businessType} />
                ))}
                {jobs.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
}

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function DraggableJobCard({ job, businessType }: { job: Job, businessType: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: job.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none cursor-grab active:cursor-grabbing">
            <JobCard
                job={{
                    ...job,
                    createdAt: job.createdAt.toISOString(),
                    updatedAt: job.updatedAt.toISOString(),
                }}
                // We don't want buttons inside draggable to capture events easily, or we do?
                // Standard JobCard has buttons. Dragging might be tricky if clicking button starts drag.
                // Usually we use a drag handle or ensure buttons stop propagation.
                // For now, assume entire card is draggable.
                businessType={businessType}
                onStatusUpdate={async (id, s) => {
                    await updateJobStatus(id, s);
                    toast.success(`Status updated to ${s}`);
                }}
                onMarkReady={async (id) => {
                    // Use lowercase 'ready' to match business type config
                    await updateJobStatus(id, 'ready');
                    toast.success('Marked as ready!');
                }}
                onNotifyCustomer={async (jobId) => {
                    try {
                        const res = await fetch(`/api/jobs/${jobId}/notify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ messageType: 'ready' })
                        });
                        if (res.ok) {
                            toast.success('Customer notified via WhatsApp!');
                        } else {
                            const data = await res.json();
                            toast.error(data.error || 'Failed to notify customer');
                        }
                    } catch (error) {
                        toast.error('Failed to send notification');
                    }
                }}
            />
        </div>
    );
}
