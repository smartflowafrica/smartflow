'use client';

import { useState } from 'react';
import { Lock, Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserAuthControlProps {
    userId: string;
    userEmail: string;
}

export default function UserAuthControl({ userId, userEmail }: UserAuthControlProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSetPassword = async () => {
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to set password');
            }

            toast.success(data.message || 'Password set successfully');
            setPassword(''); // Clear sensitive data
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-500" />
                Security & Login
            </h2>

            <div className="space-y-4">
                <p className="text-sm text-slate-500">
                    Set a new password for <span className="font-medium text-slate-700">{userEmail}</span>.
                    This will allow them to log in immediately.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="password"
                        placeholder="New Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        onClick={handleSetPassword}
                        disabled={isLoading || password.length < 6}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Set Password
                            </>
                        )}
                    </button>
                </div>

                <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg text-xs">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                        This will override any existing password. Ideally, users should reset their own passwords via email,
                        but you can use this for manual onboarding.
                    </p>
                </div>
            </div>
        </div>
    );
}
