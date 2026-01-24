'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentBranchId } from './branch';

export interface CreateJobParams {
    clientId: string;
    description: string;
    customerPhone: string;
    customerName: string;
    priority?: string;
    dueDate?: string;
    notes?: string;
    metadata?: any;
    price?: number;
}

export async function createJob(params: CreateJobParams) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const branchId = await getCurrentBranchId();

        // Find or Create Customer
        let customer = await prisma.customer.findUnique({
            where: {
                clientId_phone: {
                    clientId: params.clientId,
                    phone: params.customerPhone
                }
            }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    clientId: params.clientId,
                    branchId: branchId || undefined,
                    phone: params.customerPhone,
                    name: params.customerName,
                    firstVisit: new Date(),
                    totalVisits: 1,
                }
            });
        } else {
            await prisma.customer.update({
                where: { id: customer.id },
                data: {
                    totalVisits: { increment: 1 },
                    lastVisit: new Date()
                }
            });
        }

        // Get client business name for the notification
        const client = await prisma.client.findUnique({
            where: { id: params.clientId },
            select: { businessName: true }
        });

        const job = await prisma.job.create({
            data: {
                clientId: params.clientId,
                branchId: branchId || undefined,
                customerId: customer.id,
                customerPhone: params.customerPhone,
                customerName: params.customerName,
                description: params.description,
                status: 'received', // Use lowercase to match status stages
                priority: params.priority || 'MEDIUM',
                dueDate: params.dueDate ? new Date(params.dueDate) : null,
                notes: params.notes,
                price: params.price,
                metadata: params.metadata,
            }
        });

        // Send WhatsApp notification for car check-in
        try {
            const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
            const whatsapp = new WhatsAppService();
            const checkInMessage = `Hello ${params.customerName}! 👋

Your car has been checked in at ${client?.businessName || 'our shop'}.

📋 Service: ${params.description}
🔖 Job ID: ${job.id.slice(0, 8).toUpperCase()}

We'll keep you updated on the progress. Thank you for choosing us! 🙏`;

            await whatsapp.sendMessage(params.customerPhone, checkInMessage, params.clientId);
        } catch (wsError) {
            console.error('WhatsApp notification failed (job check-in):', wsError);
            // Don't fail the job creation if WhatsApp fails
        }

        revalidatePath('/client');
        return { success: true, data: job };

    } catch (error) {
        console.error('Create Job Error:', error);
        return { success: false, error: 'Failed to create job' };
    }
}

export async function updateJobStatus(jobId: string, status: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const job = await prisma.job.update({
            where: { id: jobId },
            data: {
                status,
                updatedAt: new Date(),
                // Only set completedAt when job is actually completed and paid
                completedAt: status === 'COMPLETED' || status === 'completed' ? new Date() : undefined
            },
            include: {
                client: { select: { businessName: true } }
            }
        });

        // Send WhatsApp notification when job is ready for pickup
        if (status === 'ready' || status === 'READY') {
            try {
                const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
                const whatsapp = new WhatsAppService();
                const readyMessage = `Great news, ${job.customerName}! 🎉

Your car is now READY for pickup at ${job.client?.businessName || 'our shop'}! 🚗✨

📋 Service: ${job.description}
🔖 Job ID: ${job.id.slice(0, 8).toUpperCase()}

Please visit us at your earliest convenience to collect your vehicle. Thank you for your patience! 🙏`;

                await whatsapp.sendMessage(job.customerPhone, readyMessage, job.clientId);
            } catch (wsError) {
                console.error('WhatsApp notification failed (ready):', wsError);
            }
        }

        revalidatePath('/client');
        revalidatePath('/client/jobs');
        return { success: true, data: job };
    } catch (error) {
        console.error('Update Job Status Error:', error);
        return { success: false, error: 'Failed to update job status' };
    }
}

export async function getClientJobs(clientId: string) {
    try {
        const branchId = await getCurrentBranchId();

        const whereClause: any = { clientId };
        if (branchId) {
            whereClause.branchId = branchId;
        }

        const jobs = await prisma.job.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: true,
                branch: true
            }
        });
        return { success: true, data: jobs };
    } catch (error) {
        console.error('Get Jobs Error:', error);
        return { success: false, error: 'Failed to fetch jobs' };
    }
}

export async function getActiveJobs(clientId: string) {
    try {
        const branchId = await getCurrentBranchId();

        const whereClause: any = {
            clientId,
            status: { notIn: ['completed', 'COMPLETED'] }
        };
        if (branchId) {
            whereClause.branchId = branchId;
        }

        const jobs = await prisma.job.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });
        return { success: true, data: jobs };
    } catch (error) {
        console.error('Get Active Jobs Error:', error);
        return { success: false, error: 'Failed to fetch active jobs' };
    }
}
