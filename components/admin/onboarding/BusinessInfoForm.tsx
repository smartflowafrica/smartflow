'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessInfoSchema } from '@/lib/schemas/onboarding';
import type { z } from 'zod';

type FormData = z.infer<typeof businessInfoSchema>;

interface BusinessInfoFormProps {
    defaultValues?: Partial<FormData>;
    onSubmit: (data: FormData) => void;
}

export function BusinessInfoForm({ defaultValues, onSubmit }: BusinessInfoFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(businessInfoSchema),
        defaultValues,
    });

    return (
        <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Business Information</h2>
                    <p className="text-sm text-slate-500">Enter the core details for this client.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Business Name</label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="e.g. Quick Fix Auto"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Owner Name</label>
                        <input
                            {...register('owner')}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="e.g. John Doe"
                        />
                        {errors.owner && <p className="text-xs text-red-500">{errors.owner.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="client@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                            {...register('phone')}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="08012345678"
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Address</label>
                        <textarea
                            {...register('address')}
                            className="w-full px-3 py-2 border rounded-md"
                            rows={3}
                            placeholder="Enter full business address"
                        />
                        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                    </div>
                </div>
            </div>
        </form>
    );
}
