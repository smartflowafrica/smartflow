'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCustomer } from '@/app/actions/customers';
import { toast } from 'sonner';
import { X, UserPlus } from 'lucide-react';

const createCustomerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'Valid phone number required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    notes: z.string().optional(),
});

type CreateCustomerForm = z.infer<typeof createCustomerSchema>;

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    notes?: string | null;
}

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    onSuccess: () => void;
    customer?: Customer | null;
}

export function AddCustomerModal({ isOpen, onClose, clientId, onSuccess, customer }: AddCustomerModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCustomerForm>({
        resolver: zodResolver(createCustomerSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            notes: ''
        }
    });

    // Reset form when opening/closing or changing customer
    useEffect(() => {
        if (isOpen) {
            if (customer) {
                setValue('name', customer.name);
                setValue('phone', customer.phone);
                setValue('email', customer.email || '');
                setValue('notes', customer.notes || '');
            } else {
                reset({ name: '', phone: '', email: '', notes: '' });
            }
        }
    }, [isOpen, customer, setValue, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: CreateCustomerForm) => {
        setIsLoading(true);
        try {
            if (customer) {
                // Update mode
                const { updateCustomer } = await import('@/app/actions/customers');
                const result = await updateCustomer(customer.id, {
                    name: data.name,
                    phone: data.phone,
                    email: data.email || undefined,
                    notes: data.notes,
                });

                if (!result.success) throw new Error(result.error);
                toast.success('Customer updated successfully!');
            } else {
                // Create mode
                const result = await createCustomer(clientId, {
                    name: data.name,
                    phone: data.phone,
                    email: data.email || undefined,
                    notes: data.notes,
                });

                if (!result.success) throw new Error(result.error);
                toast.success('Customer added successfully!');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error saving customer:', error);
            toast.error(error.message || 'Failed to save customer');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <UserPlus size={20} className="text-blue-600" />
                        <h2 className="font-semibold text-lg text-slate-900">
                            {customer ? 'Edit Customer' : 'Add New Customer'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={20} className="text-slate-400 hover:text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Jane Doe"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                        <input
                            {...register('phone')}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="08012345678"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="jane@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                customer ? 'Update Customer' : 'Add Customer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
