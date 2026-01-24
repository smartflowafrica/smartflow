'use client';

import { useState, useEffect } from 'react';
import { Search, X, User, MessageSquarePlus } from 'lucide-react';
import { createConversation } from '@/app/actions/conversations';
import { getCustomers } from '@/app/actions/customers';
import { toast } from 'sonner';

interface CreateConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    onSuccess: (conversationId: string) => void;
}

export function CreateConversationModal({ isOpen, onClose, clientId, onSuccess }: CreateConversationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);

    const [form, setForm] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        if (isOpen && clientId) {
            loadCustomers();
        }
    }, [isOpen, clientId]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCustomers(customers.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phone.includes(searchTerm)
            ));
        } else {
            setFilteredCustomers(customers);
        }
    }, [searchTerm, customers]);

    const loadCustomers = async () => {
        try {
            const res = await getCustomers(clientId);
            if (res.success && res.data) {
                setCustomers(res.data);
                setFilteredCustomers(res.data);
            }
        } catch (error) {
            console.error('Failed to load customers', error);
        }
    };

    if (!isOpen) return null;

    const handleCreate = async (name: string, phone: string, customerId?: string) => {
        setIsLoading(true);
        try {
            const res = await createConversation(clientId, { name, phone, customerId });
            if (res.success && res.data) {
                toast.success('Conversation started');
                onSuccess(res.data.id);
                onClose();
            } else {
                throw new Error(res.error);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to start conversation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-xl sticky top-0">
                    <div className="flex items-center gap-2">
                        <MessageSquarePlus size={20} className="text-blue-600" />
                        <h2 className="font-semibold text-lg text-slate-900">New Conversation</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={20} className="text-slate-400 hover:text-slate-600" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Search Existing Customers */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Select Existing Customer
                        </label>
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-lg">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleCreate(c.name, c.phone, c.id)}
                                        className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{c.name}</p>
                                            <p className="text-xs text-slate-500">{c.phone}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                                            <User size={14} />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="p-3 text-xs text-slate-400 text-center">No customers found</p>
                            )}
                        </div>
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">OR START WITH NEW NUMBER</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Manual Entry */}
                    <div className="space-y-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter name..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number..."
                            />
                        </div>
                        <button
                            onClick={() => handleCreate(form.name, form.phone)}
                            disabled={!form.name || !form.phone || isLoading}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isLoading ? 'Starting...' : 'Start Conversation'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
