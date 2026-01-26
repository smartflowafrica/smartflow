'use client';

import { useState } from 'react';
import { useClient } from '@/hooks/useClient';
import { updateClientIntegrations } from '@/app/actions/client-settings';
import { toast } from 'sonner';
import { Loader2, Save, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import WhatsAppConnect from './WhatsAppConnect'; // Using existing component

export default function IntegrationSettings() {
    const { client } = useClient();
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form state with existing values masked if present
    const [data, setData] = useState({
        paystackPublicKey: client?.integrations?.paystackPublicKey || '',
        paystackSecretKey: client?.integrations?.paystackSecretKey || '',
    });

    const hasPaystack = !!client?.integrations?.paystackSecretKey;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateClientIntegrations(client!.id, {
                paystackPublicKey: data.paystackPublicKey,
                paystackSecretKey: data.paystackSecretKey
            });

            if (result.success) {
                toast.success('Payment settings updated successfully');
            } else {
                toast.error(result.error || 'Failed to update settings');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* WhatsApp Section */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-green-600">WhatsApp</span> Configuration
                </h2>
                {/* @ts-ignore */}
                <WhatsAppConnect initialStatus={client?.integrations?.whatsappStatus || 'disconnected'} />
            </div>

            <hr className="border-slate-200" />

            {/* Paystack Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <CreditCard className="text-blue-600" size={24} />
                        Paystack Payment Gateway
                    </h2>
                    {hasPaystack ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle size={14} />
                            Active
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                            <AlertCircle size={14} />
                            Not Configured
                        </span>
                    )}
                </div>

                <p className="text-sm text-slate-500 mb-6">
                    Enter your Paystack API Keys to receive payments directly.
                    You can find these in your <a href="https://dashboard.paystack.com/#/settings/developer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Paystack Dashboard</a>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Public Key</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={data.paystackPublicKey}
                                onChange={(e) => setData({ ...data, paystackPublicKey: e.target.value })}
                                placeholder="pk_test_..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                value={data.paystackSecretKey}
                                onChange={(e) => setData({ ...data, paystackSecretKey: e.target.value })}
                                placeholder="sk_test_..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Your secret key is stored securely and never shown in plain text after saving.
                        </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Keys
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
