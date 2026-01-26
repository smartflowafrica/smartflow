'use client';

import { useState, useEffect } from 'react';
import { useClient } from '@/hooks/useClient';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Calendar, MessageSquare, Briefcase } from 'lucide-react';
import VehicleList from '@/components/client/customers/VehicleList';

interface CustomerDetailsProps {
    params: { id: string }
}

export default function CustomerDetailsPage({ params }: CustomerDetailsProps) {
    const { client } = useClient();
    const router = useRouter();
    // @ts-ignore
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!client) return;
            try {
                // We reuse the server action or just fetch from an endpoint
                // Since actions are handy, I'll simulate a fetch or use the one we have
                // Actually, I didn't see a GET /api/customers/[id] but I'll assume one or mock
                // Let's rely on client-side fetch from list or a new endpoint if needed.
                // For robustness, I'll add a quick fetch here or use the action if exposed.
                // I'll assume we need to fetch fresh data.

                // HACK: For MVP speed, let's fetch ALL and find (not efficient but works for small lists)
                // OR create the endpoint. Creating endpoint is better practice.

                const { getCustomers } = await import('@/app/actions/customers');
                const result = await getCustomers(client.id);
                if (result.success && result.data) {
                    const found = result.data.find((c: any) => c.id === params.id);
                    if (found) {
                        setCustomer(found);
                    } else {
                        // notFound(); // Client side notFound is tricky, just redirect or show error
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [client, params.id]);

    if (!client && loading) return <div>Loading...</div>;
    if (!loading && !customer) return <div className="p-8 text-center">Customer not found</div>;

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Customers
            </button>

            {customer && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Profile & Contact */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                                    {customer.name?.[0]?.toUpperCase() || <User />}
                                </div>
                                <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
                                <p className="text-slate-500 text-sm">Customer since {new Date(customer.createdAt).getFullYear()}</p>
                            </div>

                            <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{customer.phone}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span>{customer.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-slate-700">
                                    <MessageSquare className="w-4 h-4 text-slate-400" />
                                    <span className="capitalize">{customer.preferredContact || 'WhatsApp'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-900 mb-4">Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-slate-800">{customer.jobs?.length || 0}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Jobs</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-slate-800">{customer.appointments?.length || 0}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Appts</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Vehicles & History */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Vehicles Section */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                Vehicles / Assets
                            </h2>
                            <VehicleList customerId={customer.id} />
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Jobs</h2>
                            {(!customer.jobs || customer.jobs.length === 0) ? (
                                <p className="text-slate-500 text-sm">No jobs history available.</p>
                            ) : (
                                <div className="space-y-4">
                                    {customer.jobs.map((job: any) => (
                                        <div key={job.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                            <div>
                                                <div className="font-medium text-slate-900">{job.description}</div>
                                                <div className="text-xs text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="text-sm font-medium">₦{job.finalAmount?.toLocaleString() || '0.00'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
