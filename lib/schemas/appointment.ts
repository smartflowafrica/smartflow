import { z } from 'zod';

export const createAppointmentSchema = z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    customerId: z.string().optional(), // Optional if creating new customer inline
    customerName: z.string().min(2, 'Customer name is required'),
    customerPhone: z.string().min(10, 'Valid phone number is required'),
    service: z.string().min(1, 'Service name is required'),
    date: z.string(), // ISO Date string
    time: z.string().min(1, 'Time is required'), // "10:00 AM" or "14:00"
    notes: z.string().optional(),
});

export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>;
