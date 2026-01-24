'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function SignOutButton({ className }: { className?: string }) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={className || "w-full mt-2 flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"}
        >
            <LogOut size={16} />
            Sign Out
        </button>
    );
}
