import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    sku: z.string().optional(),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price cannot be negative")),
    cost: z.preprocess((val) => Number(val), z.number().min(0, "Cost cannot be negative").optional().default(0)),
    quantity: z.preprocess((val) => Number(val), z.number().int().min(0, "Quantity cannot be negative").default(0)),
    lowStockThreshold: z.preprocess((val) => Number(val), z.number().int().min(0).default(5)),
    category: z.string().optional(),
    isActive: z.boolean().optional().default(true)
});

export type ProductInput = z.infer<typeof productSchema>;
