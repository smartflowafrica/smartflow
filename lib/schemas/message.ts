import { z } from 'zod';

export const sendMessageSchema = z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    customerPhone: z.string().min(10, 'Invalid phone number'),
    customerName: z.string().optional(),
    messageText: z.string().min(1, 'Message cannot be empty'),
    category: z.string().optional().default('general'),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;
