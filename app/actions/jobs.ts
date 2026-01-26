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
    items?: {
        productId?: string;
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    vehicleId?: string;
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
                vehicleId: params.vehicleId,
                items: {
                    create: params.items?.map(item => ({
                        productId: item.productId,
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total
                    }))
                }
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

        // Handle Stock Deduction on Completion
        let stockDeducted = false;
        if (status === 'COMPLETED' || status === 'completed') {
            const currentJob = await prisma.job.findUnique({
                where: { id: jobId },
                include: { items: true }
            });

            if (currentJob && !currentJob.stockDeducted) {
                // Deduct stock
                for (const item of currentJob.items) {
                    if (item.productId && item.quantity > 0) {
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: { quantity: { decrement: item.quantity } }
                        });
                    }
                }
                stockDeducted = true;
            } else if (currentJob?.stockDeducted) {
                stockDeducted = true; // Already deducted
            }
        }

        const updateData: any = {
            status,
            updatedAt: new Date(),
            completedAt: status === 'COMPLETED' || status === 'completed' ? new Date() : undefined
        };

        // Only update stockDeducted if we actually did something or it's relevant
        if (stockDeducted) {
            updateData.stockDeducted = true;
        }

        const job = await prisma.job.update({
            where: { id: jobId },
            data: updateData,
            include: {
                client: { select: { businessName: true } }
            }
        });

        // Send WhatsApp notification when job is ready for pickup
        if ((status === 'ready' || status === 'READY') && job.paymentStatus !== 'PAID') {
            try {
                // Generate Invoice PDF
                const { generateInvoicePDF } = await import('@/lib/services/invoice-generator');
                const pdfData = await generateInvoicePDF(job.id, 'invoice');

                const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
                const whatsapp = new WhatsAppService();

                const readyMessage = `Great news, ${job.customerName}! 🎉

Your car is now READY for pickup at ${job.client?.businessName || 'our shop'}! 🚗✨

📋 Service: ${job.description}
💰 Amount Due: ₦${(job.finalAmount || job.price || 0).toLocaleString()}

📄 *Please see the attached Invoice for details.*

Please visit us at your earliest convenience to collect your vehicle. Thank you for your patience! 🙏`;

                await whatsapp.sendMedia(
                    job.customerPhone,
                    pdfData.base64,
                    readyMessage,
                    job.clientId,
                    'document',
                );

            } catch (wsError) {
                console.error('WhatsApp notification failed (ready):', wsError);
            }
        }
        // If PAID and Ready/Completed, logic handled in Payment Webhook usually, 
        // but if manual status change caused "Paid", might want to handle it (though unlikely to happen here first)

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

export async function recordJobPayment(jobId: string, amount: number, method: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { client: { select: { businessName: true } } }
        });

        if (!job) return { success: false, error: 'Job not found' };

        // Create Payment Record
        const payment = await prisma.jobPayment.create({
            data: {
                jobId,
                clientId: job.clientId,
                amount: amount * 100, // Store in kobo/cents
                currency: 'NGN',
                reference: `MAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                status: 'success',
                paymentMethod: method,
                paidAt: new Date()
            }
        });

        // Update Job Status
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                paymentStatus: 'PAID',
                finalAmount: amount * 100, // Store in kobo
                status: 'completed', // Auto-complete if paid
                completedAt: new Date()
            }
        });

        // Send WhatsApp Receipt
        try {
            // Generate Receipt PDF
            // Map method to readable string
            let readableMethod = 'Paid';
            if (method === 'CASH') readableMethod = 'Cash';
            else if (method === 'TRANSFER') readableMethod = 'Bank Transfer';
            else if (method === 'POS') readableMethod = 'POS';

            const { generateInvoicePDF } = await import('@/lib/services/invoice-generator');
            const pdfData = await generateInvoicePDF(job.id, 'receipt', readableMethod);

            const { WhatsAppService } = await import('@/lib/api/evolution-whatsapp');
            const whatsapp = new WhatsAppService();

            const receiptMessage = `Payment Received! ✅

Thank you, ${job.customerName}! Your payment has been confirmed.

💰 Amount: ₦${amount.toLocaleString()}
📋 Service: ${job.description}
🔖 Job ID: ${job.id.slice(0, 8).toUpperCase()}

📄 *Please see the attached Receipt.*

Thank you for choosing ${job.client?.businessName || 'us'}!`;

            await whatsapp.sendMedia(
                job.customerPhone,
                pdfData.base64,
                receiptMessage,
                job.clientId,
                'document'
            );
        } catch (wsError) {
            console.error('WhatsApp notification failed (manual payment):', wsError);
        }

        revalidatePath('/client');
        revalidatePath('/client/jobs');
        return { success: true, data: updatedJob };

    } catch (error) {
        console.error('Record Payment Error:', error);
        return { success: false, error: 'Failed to record payment' };
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
