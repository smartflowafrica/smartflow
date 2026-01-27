'use client';

import { useState } from 'react';
import { useClient } from '@/hooks/useClient';
import { toast } from 'sonner';
import { updateClientProfile, updateClientBranding } from '@/app/actions/client-settings';
import { Save, Loader2, Building, Palette, Users, Link2, CreditCard, Calendar, MessageSquare, Bell } from 'lucide-react';
import { TeamSettings } from '@/components/client/settings/TeamSettings';
import BillingSettings from '@/components/client/settings/BillingSettings';
import BookingSettings from '@/components/client/settings/BookingSettings';
import BotSettings from '@/components/client/settings/BotSettings';
import IntegrationSettings from '@/components/client/settings/IntegrationSettings';
import { NotificationSettings } from '@/components/client/settings/NotificationSettings';
import { getAllBusinessTypes } from '@/lib/config/business-types';

import { useSearchParams } from 'next/navigation';

export default function ClientSettingsPage() {
    const { client } = useClient();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        businessName: client?.businessName || '',
        businessType: client?.businessType || '',
        phone: client?.phone || '',
        address: client?.address || '',
    });

    // Branding State
    const [brandingData, setBrandingData] = useState({
        primaryColor: client?.branding?.primaryColor || '#3B82F6',
        secondaryColor: client?.branding?.secondaryColor || '#1E293B',
        font: client?.branding?.font || 'Inter',
        tagline: client?.branding?.tagline || '',
        logoUrl: client?.branding?.logoUrl || '',
        // @ts-ignore
        bankName: client?.branding?.bankDetails?.bankName || '',
        // @ts-ignore
        accountNumber: client?.branding?.bankDetails?.accountNumber || '',
        // @ts-ignore
        accountName: client?.branding?.bankDetails?.accountName || '',
    });

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateClientProfile(client!.id, profileData);
            if (result.success) {
                toast.success('Profile updated successfully');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBrandingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateClientBranding(client!.id, brandingData);
            if (result.success) {
                toast.success('Branding updated successfully');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to update branding');
        } finally {
            setIsLoading(false);
        }
    };

    if (!client) return <div>Loading settings...</div>;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <SettingsIcon size={28} />
                Settings
            </h1>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'profile'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Building size={18} />
                    Business Profile
                </button>
                <button
                    onClick={() => setActiveTab('branding')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'branding'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Palette size={18} />
                    Branding
                </button>
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'integrations'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Link2 size={18} />
                    Integrations
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'team'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Users size={18} />
                    Team
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'billing'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <CreditCard size={18} />
                    Billing
                </button>
                <button
                    onClick={() => setActiveTab('booking')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'booking'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Calendar size={18} />
                    Booking
                </button>
                <button
                    onClick={() => setActiveTab('chatbot')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'chatbot'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <MessageSquare size={18} />
                    Chatbot
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'notifications'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Bell size={18} />
                    Notifications
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Business Information</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                                <input
                                    type="text"
                                    value={profileData.businessName}
                                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                                <select
                                    value={profileData.businessType}
                                    onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    {getAllBusinessTypes().map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Visual Identity</h2>
                    <form onSubmit={handleBrandingSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={brandingData.primaryColor}
                                        onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                                        className="h-10 w-20 rounded border border-slate-300 p-1"
                                    />
                                    <input
                                        type="text"
                                        value={brandingData.primaryColor}
                                        onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={brandingData.secondaryColor}
                                        onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                                        className="h-10 w-20 rounded border border-slate-300 p-1"
                                    />
                                    <input
                                        type="text"
                                        value={brandingData.secondaryColor}
                                        onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Font Family</label>
                                <select
                                    value={brandingData.font}
                                    onChange={(e) => setBrandingData({ ...brandingData, font: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="Inter">Inter (Sans-serif)</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Lato">Lato</option>
                                    <option value="Montserrat">Montserrat</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Logo</label>
                                <div className="flex items-center gap-4">
                                    {brandingData.logoUrl && (
                                        <div className="w-16 h-16 border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={brandingData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const formData = new FormData();
                                                formData.append('file', file);

                                                try {
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                    if (!res.ok) throw new Error('Upload failed');
                                                    const data = await res.json();
                                                    setBrandingData(prev => ({ ...prev, logoUrl: data.url }));
                                                    toast.success('Logo uploaded');
                                                } catch (err) {
                                                    toast.error('Failed to upload logo');
                                                }
                                            }}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Recommended: Square PNG or JPG, max 2MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={brandingData.tagline}
                                    onChange={(e) => setBrandingData({ ...brandingData, tagline: e.target.value })}
                                    placeholder="e.g. Quality Service You Can Trust"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-4">
                                <h3 className="text-md font-medium text-slate-800 mb-3">Bank Account Details (For Invoices)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                                        <input
                                            type="text"
                                            // @ts-ignore
                                            value={brandingData.bankName}
                                            // @ts-ignore
                                            onChange={(e) => setBrandingData({ ...brandingData, bankName: e.target.value })}
                                            placeholder="e.g. GTBank"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                                        <input
                                            type="text"
                                            // @ts-ignore
                                            value={brandingData.accountNumber}
                                            // @ts-ignore
                                            onChange={(e) => setBrandingData({ ...brandingData, accountNumber: e.target.value })}
                                            placeholder="0123456789"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
                                        <input
                                            type="text"
                                            // @ts-ignore
                                            value={brandingData.accountName}
                                            // @ts-ignore
                                            onChange={(e) => setBrandingData({ ...brandingData, accountName: e.target.value })}
                                            placeholder="e.g. Terry Mechanic Global Ltd"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
                <div className="space-y-6">
                    <IntegrationSettings />
                </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
                <TeamSettings />
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
                <BillingSettings
                    client={client}
                />
            )}

            {/* Booking Tab */}
            {activeTab === 'booking' && (
                <BookingSettings />
            )}

            {/* Chatbot Tab */}
            {activeTab === 'chatbot' && (
                <BotSettings />
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <NotificationSettings />
            )}
        </div>
    );
}

function SettingsIcon({ size }: { size: number }) {
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
