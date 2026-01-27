import { z } from 'zod';

export const serviceSchema = z.object({
    name: z.string().min(2, "Service name is required"),
    description: z.string().optional(),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price cannot be negative")),
    duration: z.preprocess((val) => Number(val), z.number().int().min(5, "Duration must be at least 5 minutes").default(30)),
    category: z.string().optional(),
    metadata: z.any().optional(),
    isActive: z.boolean().optional().default(true),
    postToStatus: z.boolean().optional(),
    pricingRules: z.any().optional(),
    commitmentFee: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
