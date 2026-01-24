'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
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
                redirect: false
            });

            if (result?.error) {
                toast.error('Invalid credentials');
                return;
            }

            toast.success('Login successful!');

            // Redirect to client dashboard (NextAuth session will contain role info)
            router.push('/client');
            router.refresh();

        } catch (error) {
            toast.error('An error occurred');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10">
                    <div className="bg-white rounded-2xl p-4 inline-block mb-8 shadow-lg">
                        <img src="/newlogo.png" alt="SmartFlow Africa" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Welcome to<br />SmartFlow Africa
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                        Streamline your business operations with AI-powered automation designed for Nigerian businesses.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-start gap-3 text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Real-time Dashboard</h3>
                            <p className="text-sm text-blue-100">Monitor your business metrics in real-time</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">WhatsApp Integration</h3>
                            <p className="text-sm text-blue-100">Communicate with customers seamlessly</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Smart Scheduling</h3>
                            <p className="text-sm text-blue-100">Manage appointments effortlessly</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="bg-white rounded-2xl p-4 inline-block shadow-lg">
                            <img src="/newlogo.png" alt="SmartFlow Africa" className="h-14 w-auto" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
                            <p className="text-slate-600">Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-4 text-center">
                                Demo Accounts
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                                    <div className="text-xs font-bold text-slate-700 mb-1">Admin</div>
                                    <div className="text-xs text-slate-600 mb-0.5">admin@smartflowafrica.com</div>
                                    <div className="text-xs font-mono text-blue-600">admin123</div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div className="text-xs font-bold text-slate-700 mb-1">Client</div>
                                    <div className="text-xs text-slate-600 mb-0.5">chidi@example.com</div>
                                    <div className="text-xs font-mono text-blue-600">password123</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        © 2024 SmartFlow Africa. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
