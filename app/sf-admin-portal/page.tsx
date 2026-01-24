'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid admin credentials');
                return;
            }

            // Verify admin access by checking the session
            const session = await fetch('/api/auth/session').then(res => res.json());
            const userRole = session?.user?.role;
            const userEmail = session?.user?.email;

            const allowedEmails = ['admin@smartflowafrica.com', 'ibiyinka@smartflowafrica.com'];

            if (userRole !== 'ADMIN' && !allowedEmails.includes(userEmail || '')) {
                toast.error('Unauthorized: Admin access only.');
                return;
            }

            toast.success('Admin access granted');
            router.push('/admin');

        } catch (error) {
            toast.error('Login failed');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
                    <img src="/newlogo.png" alt="SmartFlow Africa" className="h-12 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Admin Portal</h1>
                    <p className="text-slate-500 text-sm mt-1">Secure Gateway</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all text-slate-900"
                                placeholder="admin@smartflowafrica.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all text-slate-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Authenticating...' : 'Access Portal'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">
                            Authorized personnel only. All activities are monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
