'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAllBusinessTypes } from '@/lib/config/business-types';

const clientBusinessInfoSchema = z.object({
    name: z.string().min(2, "Business name is required"),
    owner: z.string().min(2, "Owner name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    // email is read-only usually, or optional to update
    address: z.string().optional(),
    type: z.string().min(1, "Business Type is required"),
});

type FormData = z.infer<typeof clientBusinessInfoSchema>;

interface ClientBusinessInfoFormProps {
    defaultValues?: Partial<FormData>;
    onSubmit: (data: FormData) => void;
}

export function ClientBusinessInfoForm({ defaultValues, onSubmit }: ClientBusinessInfoFormProps) {
    const businessTypes = getAllBusinessTypes();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(clientBusinessInfoSchema),
        defaultValues,
    });

    return (
        <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Business Information</h2>
                    <p className="text-sm text-slate-500">Confirm your business details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Business Name</label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 border rounded-md bg-slate-50"
                            placeholder="e.g. Quick Fix Auto"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Business Type</label>
                        <select
                            {...register('type')}
                            className="w-full px-3 py-2 border rounded-md bg-white"
                        >
                            <option value="">Select a type...</option>
                            {businessTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.icon} {type.name}
                                </option>
                            ))}
                        </select>
                        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Owner Name</label>
                        <input
                            {...register('owner')}
                            className="w-full px-3 py-2 border rounded-md bg-slate-50"
                            placeholder="e.g. John Doe"
                        />
                        {errors.owner && <p className="text-xs text-red-500">{errors.owner.message}</p>}
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
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Address</label>
                    <textarea
                        {...register('address')}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                        placeholder="Street, City, State"
                    />
                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
            </div>

            {/* Hidden submit button to allow Enter key submission if needed, 
                though requestSubmit() from parent targets the form event directly. */}
            <input type="submit" className="hidden" />
        </form>
    );
}
