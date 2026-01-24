'use client';

import { useState } from 'react';
import { MessageSquare, Users, Sparkles } from 'lucide-react';

interface WhatsAppConfig {
    greetingMessage: string;
    autoReply: boolean;
    autoReplyRules: {
        keywords: string;
        response: string;
    }[];
    teamMembers: string[]; // List of names or numbers
}

interface WhatsAppSetupProps {
    defaultValues?: Partial<WhatsAppConfig>;
    onSubmit: (config: WhatsAppConfig) => void;
}

export function WhatsAppSetup({ defaultValues, onSubmit }: WhatsAppSetupProps) {
    const [config, setConfig] = useState<WhatsAppConfig>({
        greetingMessage: defaultValues?.greetingMessage || 'Hello! Welcome to [Business Name]. How can we help you today?',
        autoReply: defaultValues?.autoReply || true,
        autoReplyRules: defaultValues?.autoReplyRules || [
            { keywords: 'price, cost', response: 'Our prices vary by service. Please check our catalog or ask for a quote.' },
            { keywords: 'location, address', response: 'We are located at [Address].' }
        ],
        teamMembers: defaultValues?.teamMembers || []
    });

    const [newMember, setNewMember] = useState('');

    const addMember = () => {
        if (newMember.trim()) {
            setConfig(prev => ({ ...prev, teamMembers: [...prev.teamMembers, newMember] }));
            setNewMember('');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="text-green-600" />
                    WhatsApp Configuration
                </h2>
                <p className="text-sm text-slate-500 mb-6">Set up how your AI assistant interacts with customers on WhatsApp.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Greeting Message</label>
                        <p className="text-xs text-slate-500 mb-2">Sent when a new customer messages you for the first time.</p>
                        <textarea
                            value={config.greetingMessage}
                            onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-slate-50"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                        <div>
                            <span className="font-semibold block text-green-900">AI Auto-Reply</span>
                            <span className="text-xs text-green-700">Automatically respond to common questions</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.autoReply}
                                onChange={(e) => setConfig({ ...config, autoReply: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Users className="text-blue-600" />
                    Team Members
                </h2>
                <p className="text-sm text-slate-500 mb-4">Add staff members who can handle escalations.</p>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMember()}
                        placeholder="Enter name (e.g. John Doe)"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={addMember}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {config.teamMembers.map((member, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {member}
                            <button
                                onClick={() => setConfig(prev => ({ ...prev, teamMembers: prev.teamMembers.filter((_, i) => i !== idx) }))}
                                className="text-slate-400 hover:text-red-500"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    {config.teamMembers.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No team members added yet.</p>
                    )}
                </div>
            </div>

            {/* Hidden Trigger */}
            <div id="step-submit-trigger" onClick={() => onSubmit(config)} style={{ display: 'none' }} />
        </div>
    );
}
