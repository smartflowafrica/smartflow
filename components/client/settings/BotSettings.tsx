'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, MessageSquare } from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    isActive: boolean;
    priority: number;
}

export default function BotSettings() {
    const [config, setConfig] = useState({
        greetingMessage: '',
        fallbackMessage: '',
        workingHoursOnly: false,
        isEnabled: true
    });

    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        keywords: '',
        priority: 0
    });

    useEffect(() => {
        fetchFAQs();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/client/bot-config');
            if (res.ok) {
                const data = await res.json();
                setConfig({
                    greetingMessage: data.greetingMessage || '',
                    fallbackMessage: data.fallbackMessage || '',
                    workingHoursOnly: data.workingHoursOnly || false,
                    isEnabled: data.isEnabled ?? true
                });
            }
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    };

    const saveConfig = async () => {
        try {
            const res = await fetch('/api/client/bot-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                alert('Settings saved successfully!');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const fetchFAQs = async () => {
        try {
            const res = await fetch('/api/faqs');
            const data = await res.json();
            setFaqs(data.data || []);
        } catch (error) {
            console.error('Failed to fetch FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of CRUD handlers remain same) ...
    const handleCreate = async () => {
        try {
            const res = await fetch('/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
                })
            });

            if (res.ok) {
                fetchFAQs();
                setShowNewForm(false);
                setFormData({ question: '', answer: '', keywords: '', priority: 0 });
            }
        } catch (error) {
            console.error('Failed to create FAQ:', error);
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            const res = await fetch(`/api/faqs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
                })
            });

            if (res.ok) {
                fetchFAQs();
                setEditingId(null);
                setFormData({ question: '', answer: '', keywords: '', priority: 0 });
            }
        } catch (error) {
            console.error('Failed to update FAQ:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
            fetchFAQs();
        } catch (error) {
            console.error('Failed to delete FAQ:', error);
        }
    };

    const handleToggleActive = async (faq: FAQ) => {
        try {
            await fetch(`/api/faqs/${faq.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !faq.isActive })
            });
            fetchFAQs();
        } catch (error) {
            console.error('Failed to toggle FAQ:', error);
        }
    };

    const startEdit = (faq: FAQ) => {
        setEditingId(faq.id);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            keywords: faq.keywords.join(', '),
            priority: faq.priority
        });
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* General Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Welcome Message (First interaction)
                        </label>
                        <textarea
                            value={config.greetingMessage}
                            onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
                            placeholder="Hello! Welcome to our business. How can I help you?"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fallback Message (When bot doesn't understand)
                        </label>
                        <textarea
                            value={config.fallbackMessage}
                            onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
                            placeholder="I'm not sure I understood that. You can ask for our menu, address, or to book an appointment."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={config.isEnabled}
                            onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
                            id="botEnabled"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="botEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Enable Auto-Reply Bot
                        </label>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={saveConfig}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Chatbot FAQs
                        </h2>
                        <span className="text-sm text-gray-500">({faqs.length} {faqs.length === 1 ? 'entry' : 'entries'})</span>
                    </div>
                    <button
                        onClick={() => setShowNewForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add FAQ
                    </button>
                </div>

                {/* Info Banner */}
                <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 FAQs are matched based on question text and keywords. Add common customer questions and their answers.
                    </p>
                </div>

                {/* New FAQ Form */}
                {showNewForm && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">New FAQ</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Customer question (e.g., 'What are your prices?')"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <textarea
                                placeholder="Bot response..."
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                                type="text"
                                placeholder="Keywords (comma separated, e.g., 'price, cost, how much')"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Save className="w-4 h-4" />
                                    Save FAQ
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewForm(false);
                                        setFormData({ question: '', answer: '', keywords: '', priority: 0 });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ List */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {faqs.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>No FAQs configured yet.</p>
                            <p className="text-sm">Add your first FAQ to help automate responses.</p>
                        </div>
                    ) : (
                        faqs.map((faq) => (
                            <div key={faq.id} className={`px-6 py-4 ${!faq.isActive ? 'opacity-50' : ''}`}>
                                {editingId === faq.id ? (
                                    // Edit Form
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                        <textarea
                                            value={formData.answer}
                                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                        <input
                                            type="text"
                                            value={formData.keywords}
                                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(faq.id)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                            >
                                                <Save className="w-3 h-3" />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm"
                                            >
                                                <X className="w-3 h-3" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Display
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">{faq.question}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{faq.answer}</p>
                                            {faq.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {faq.keywords.map((kw, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleActive(faq)}
                                                className={`px-2 py-1 text-xs rounded ${faq.isActive
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                                    }`}
                                            >
                                                {faq.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                            <button
                                                onClick={() => startEdit(faq)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
