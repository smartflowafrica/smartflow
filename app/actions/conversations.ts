'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getConversations(clientId: string) {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { clientId },
            orderBy: { lastMessageAt: 'desc' },
            include: {
                _count: {
                    select: { messages: true }
                }
            }
        });
        return { success: true, data: conversations };
    } catch (error) {
        console.error('Get Conversations Error:', error);
        return { success: false, error: 'Failed to fetch conversations' };
    }
}

export async function getConversationMessages(clientId: string, customerPhone: string) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                clientId,
                customerPhone
            },
            orderBy: { timestamp: 'asc' }
        });
        return { success: true, data: messages };
    } catch (error) {
        console.error('Get Messages Error:', error);
        return { success: false, error: 'Failed to fetch messages' };
    }
}

export async function resolveConversation(conversationId: string) {
    try {
        const conversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                status: 'RESOLVED',
                updatedAt: new Date()
            }
        });
        revalidatePath('/client');
        return { success: true, data: conversation };
    } catch (error) {
        console.error('Resolve Conversation Error:', error);
        return { success: false, error: 'Failed to resolve conversation' };
    }
}

export async function assignConversation(conversationId: string, agentId: string, agentName: string) {
    try {
        const conversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                assignedTo: agentName,
                status: 'HUMAN_HANDLING',
                updatedAt: new Date()
            }
        });
        revalidatePath('/client');
        return { success: true, data: conversation };
    } catch (error) {
        console.error('Assign Conversation Error:', error);
        return { success: false, error: 'Failed to assign conversation' };
    }
}

export async function createConversation(clientId: string, data: { customerId?: string; name: string; phone: string }) {
    try {
        // Check if conversation already exists
        let conversation = await prisma.conversation.findFirst({
            where: {
                clientId,
                customerPhone: data.phone
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    clientId,
                    customerPhone: data.phone,
                    customerName: data.name,
                    status: 'ACTIVE',
                    lastMessageAt: new Date(),
                    unreadCount: 0
                }
            });
        } else {
            // Update the name if provided
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    customerName: data.name,
                    lastMessageAt: new Date() // Bring to top
                }
            });
        }

        revalidatePath('/client/conversations');
        return { success: true, data: conversation };
    } catch (error) {
        console.error('Create Conversation Error:', error);
        return { success: false, error: 'Failed to create conversation' };
    }
}
