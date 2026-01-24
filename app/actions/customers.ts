'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCustomers(clientId: string) {
    try {
        if (!clientId) return { success: false, error: 'Client ID is required' };

        // Fetch Customers with relation counts
        const customers = await prisma.customer.findMany({
            where: { clientId },
            include: {
                _count: {
                    select: {
                        jobs: true,
                        appointments: true
                    }
                }
            },
            orderBy: { firstVisit: 'desc' }
        });

        // Map Prisma result
        const mappedCustomers = customers.map((c: any) => ({
            ...c,
            createdAt: c.firstVisit, // Alias for UI
            jobs: [{ count: c._count.jobs || 0 }],
            appointments: [{ count: c._count.appointments || 0 }]
        }));

        return { success: true, data: mappedCustomers };

    } catch (error) {
        console.error('Error fetching customers:', error);
        return { success: false, error: `Database Error: ${(error as any)?.message || 'Unknown error'}` };
    }
}

export async function createCustomer(clientId: string, data: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
}) {
    try {
        if (!clientId) return { success: false, error: 'Client ID is required' };
        if (!data.name || !data.phone) return { success: false, error: 'Name and phone are required' };

        const customer = await prisma.customer.create({
            data: {
                clientId,
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                preferredContact: 'whatsapp',
                firstVisit: new Date(),
                lastVisit: new Date(),
            }
        });

        revalidatePath('/client/customers');
        return { success: true, data: customer };

    } catch (error: any) {
        console.error('Error creating customer:', error);
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return { success: false, error: 'A customer with this phone number already exists' };
        }
        return { success: false, error: error.message || 'Failed to create customer' };
    }
}

export async function updateCustomer(customerId: string, data: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
}) {
    try {
        if (!customerId) return { success: false, error: 'ID required' };

        const customer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
            }
        });

        revalidatePath('/client/customers');
        return { success: true, data: customer };
    } catch (error) {
        console.error('Error updating customer:', error);
        return { success: false, error: 'Failed to update customer' };
    }
}

export async function deleteCustomer(customerId: string) {
    try {
        await prisma.customer.delete({ where: { id: customerId } });
        revalidatePath('/client/customers');
        return { success: true };
    } catch (error) {
        console.error('Error deleting customer:', error);
        return { success: false, error: 'Failed to delete customer' };
    }
}
