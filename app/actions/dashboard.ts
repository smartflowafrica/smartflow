'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function getClientJobs(clientId: string) {
    noStore();
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const jobs = await prisma.job.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { customer: true }
        });

        return { success: true, data: jobs };
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return { success: false, error: 'Failed to fetch jobs' };
    }
}

export async function getDashboardStats(clientId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const jobsByStatus = await prisma.job.groupBy({
            by: ['status'],
            where: { clientId },
            _count: { status: true }
        });

        const statusCounts = jobsByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {} as Record<string, number>);

        const jobsToday = await prisma.job.count({
            where: { clientId, createdAt: { gte: today } }
        });

        const appointmentsToday = await prisma.appointment.count({
            where: {
                clientId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }
        });

        const aggregation = await prisma.job.aggregate({
            _sum: { price: true },
            where: { clientId, completedAt: { gte: today } }
        });
        const revenueToday = aggregation._sum.price || 0;

        // NEW: Actual Cash Collected (Sum of Payments)
        const paymentAggregation = await prisma.jobPayment.aggregate({
            _sum: { amount: true }, // Stored in kobo
            where: {
                clientId,
                status: 'success',
                paidAt: { gte: today }
            }
        });
        // Convert kobo to naira (assuming amount is kobo)
        const cashCollected = (paymentAggregation._sum.amount || 0) / 100;

        const messagesToday = await prisma.message.count({
            where: { clientId, timestamp: { gte: today } }
        });

        const unreadConversations = await prisma.conversation.count({
            where: {
                clientId,
                unreadCount: { gt: 0 }
            }
        });

        return {
            success: true,
            data: {
                statusCounts,
                jobsToday,
                appointmentsToday,
                messagesToday,
                unreadConversations,
                revenueToday,
                cashCollected
            }
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}

export async function getRecentAlerts(clientId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

        const alerts = await prisma.systemLog.findMany({
            where: {
                clientId,
                level: { in: ['WARNING', 'ERROR', 'CRITICAL'] },
                timestamp: { gte: cutoff }
            },
            orderBy: { timestamp: 'desc' },
            take: 5,
        });

        return { success: true, data: alerts };
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return { success: false, error: 'Failed to fetch alerts' };
    }
}
