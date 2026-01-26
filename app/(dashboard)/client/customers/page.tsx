'use client';

import { useState, useEffect, useRef } from 'react';
import { useClient } from '@/hooks/useClient';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Phone, Mail, MoreHorizontal, Edit, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

import { AddCustomerModal } from '@/components/client/AddCustomerModal';

export default function CustomersPage() {
    const { client } = useClient();
    const router = useRouter(); // Initialize router here
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modals & Actions
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (client) {
            fetchCustomers();
        }
    }, [client]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveActionId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const { getCustomers } = await import('@/app/actions/customers');
            const result = await getCustomers(client!.id);

            if (!result.success) throw new Error(result.error);

            setCustomers(result.data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            const msg = (error as any)?.message || 'Failed to load customers';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            const { deleteCustomer } = await import('@/app/actions/customers');
            const result = await deleteCustomer(id);
            if (!result.success) throw new Error(result.error);

            toast.success('Customer deleted');
            fetchCustomers();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
        setActiveActionId(null);
    };

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
                    <p className="text-slate-500">Manage your customer database</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCustomer(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Plus size={20} />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Modals */}
            {client && (
                <AddCustomerModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingCustomer(null);
                    }}
                    clientId={client.id}
                    onSuccess={fetchCustomers}
                    customer={editingCustomer}
                />
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                    <Filter size={20} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-xl border border-slate-200 flex-1 overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <UsersIcon size={32} />
                        </div>
                        <p className="text-lg font-medium text-slate-900">No customers found</p>
                        <p>Add your first customer to get started</p>
                    </div>
                ) : (
                    <div className="overflow-auto pb-48"> {/* Extra padding for dropdowns */}
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">History</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                    {customer.name?.[0]?.toUpperCase() || '#'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{customer.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">ID: {customer.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Phone size={14} /> {customer.phone}
                                                </div>
                                                {customer.email && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Mail size={14} /> {customer.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                                    {customer.jobs?.[0]?.count || 0} Jobs
                                                </span>
                                                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                                                    {customer.appointments?.[0]?.count || 0} Appts
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionId(activeActionId === customer.id ? null : customer.id);
                                                }}
                                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {activeActionId === customer.id && (
                                                <div
                                                    ref={dropdownRef}
                                                    className="absolute right-8 top-12 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
                                                >
                                                    <button
                                                        onClick={() => router.push(`/client/customers/${customer.id}`)}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <User size={16} /> View Profile
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCustomer(customer);
                                                            setIsAddModalOpen(true);
                                                            setActiveActionId(null);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <Edit size={16} /> Edit Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(customer.id)}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={16} /> Delete Customer
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
