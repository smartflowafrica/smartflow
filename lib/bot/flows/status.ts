import { ChatFlow, FlowResponse } from './types';
import prisma from '@/lib/prisma';

export class StatusFlow implements ChatFlow {
    id = 'status';

    async handle(
        step: string,
        message: string,
        data: Record<string, any>,
        context: { clientId: string; customerPhone: string; customerName?: string }
    ): Promise<FlowResponse> {

        // Single step flow: Check logic directly
        // We can check if we need to ask for more info, but usually phone is enough.

        // Find customer
        const customer = await prisma.customer.findUnique({
            where: {
                clientId_phone: {
                    clientId: context.clientId,
                    phone: context.customerPhone
                }
            },
            include: {
                jobs: {
                    where: {
                        status: { notIn: ['COMPLETED', 'CANCELLED'] } // Only active jobs
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!customer || !customer.jobs || customer.jobs.length === 0) {
            return {
                response: "I couldn't find any active jobs under your phone number at the moment. If you dropped off your vehicle recently, please allow some time for us to register it, or ask to speak to an agent.",
                nextStep: undefined // End flow
            };
        }

        const job = customer.jobs[0];

        // Format response
        let response = `📋 **Job Status Update**\n\n`;
        response += `**Job:** ${job.description}\n`;
        response += `**Status:** ${job.status}\n`; // PENDING, IN_PROGRESS, etc.

        if (job.dueDate) {
            response += `**Est. Completion:** ${job.dueDate.toLocaleDateString()} ${job.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
        }

        if (job.paymentStatus === 'PENDING' && job.finalAmount) {
            response += `\n**Payment Pending:** ₦${job.finalAmount.toLocaleString()}\n`;
            // Could add payment link here later
        }

        return {
            response,
            nextStep: undefined // End flow
        };
    }
}
