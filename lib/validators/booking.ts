import { z } from 'zod';

export const appointmentSchema = z.object({
    customerId: z.string().optional(), // Optional if new customer
    customerName: z.string().min(2, "Customer name is required"),
    customerPhone: z.string().min(10, "Valid phone number required"),
    serviceId: z.string().min(1, "Service is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    notes: z.string().optional(),
    branchId: z.string().optional(),
});

const timeSlotSchema = z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    resourceId: z.string().optional(),
});

export const bookingSettingsSchema = z.object({
    rules: z.any().optional(),
    slots: z.array(timeSlotSchema).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
