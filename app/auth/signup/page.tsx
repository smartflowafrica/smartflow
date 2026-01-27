'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Register User
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Registration failed');
                setIsLoading(false);
                return;
            }

            toast.success('Account created!');

            // 2. Auto Login
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });

            if (result?.error) {
                toast.error('Login failed. Please sign in manually.');
                router.push('/login');
            } else {
                // 3. Redirect to Onboarding
                router.push('/onboarding/client');
                router.refresh();
            }

        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10">
                    <div className="bg-white rounded-2xl p-4 inline-block mb-8 shadow-lg">
                        <img src="/newlogo.png" alt="SmartFlow Africa" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Join SmartFlow<br />Africa Today
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                        Start automating your business in minutes. No credit card required for setup.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-white/90 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-lg">1</div>
                        <div>
                            <h3 className="font-bold">Create Account</h3>
                            <p className="text-sm text-blue-100">Sign up in seconds</p>
                        </div>
                    </div>
                    <div className="w-0.5 h-8 bg-white/20 ml-5"></div>
                    <div className="flex items-center gap-3 text-white/90 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 opacity-70">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg border-2 border-white/30">2</div>
                        <div>
                            <h3 className="font-bold">Setup Profile</h3>
                            <p className="text-sm text-blue-100">Tell us about your business</p>
                        </div>
                    </div>
                    <div className="w-0.5 h-8 bg-white/20 ml-5"></div>
                    <div className="flex items-center gap-3 text-white/90 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 opacity-70">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg border-2 border-white/30">3</div>
                        <div>
                            <h3 className="font-bold">Automate</h3>
                            <p className="text-sm text-blue-100">Start growing effortlessly</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 text-center">
                        <div className="bg-white rounded-2xl p-4 inline-block shadow-lg">
                            <img src="/newlogo.png" alt="SmartFlow Africa" className="h-14 w-auto" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                            <p className="text-slate-600">Get started with your free account</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        © 2026 SmartFlow Africa. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
