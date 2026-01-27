import { z } from 'zod';

export const jobItemSchema = z.object({
    productId: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Price cannot be negative"),
    total: z.number().min(0),
});

export const createJobSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    customerPhone: z.string().min(10, "Phone number must be valid"),
    customerName: z.string().min(2, "Customer name is required"),
    priority: z.enum(['low', 'medium', 'high', 'LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
    dueDate: z.string().optional(), // ISO string expected
    notes: z.string().optional(),
    metadata: z.any().optional(),
    price: z.number().min(0).optional(),
    vehicleId: z.string().optional(),
    items: z.array(jobItemSchema).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
