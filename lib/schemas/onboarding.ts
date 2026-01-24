import { z } from 'zod';

export const businessInfoSchema = z.object({
    name: z.string().min(2, 'Business name is required'),
    owner: z.string().min(2, 'Owner name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(5, 'Address is required'),
});

export const serviceSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    priceMin: z.number().min(0),
    priceMax: z.number().min(0).optional(),
});

export const brandingSchema = z.object({
    primaryColor: z.string().regex(/^#/, 'Must be a hex code'),
    secondaryColor: z.string().regex(/^#/, 'Must be a hex code'),
    font: z.string().default('Inter'),
    logoUrl: z.string().url().optional().or(z.literal('')),
});

export const onboardingSchema = z.object({
    businessType: z.string(),
    info: businessInfoSchema,
    services: z.array(serviceSchema),
    branding: brandingSchema,
    integrations: z.object({
        whatsapp: z.boolean().default(false),
        paystack: z.boolean().default(false),
    }).optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
