'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/providers/AuthProvider';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Routes that should NOT have header/footer
    const isAuthRoute = pathname?.startsWith('/login');
    const isDashboardRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/client') || pathname?.startsWith('/admin');
    const shouldHideLayout = isAuthRoute || isDashboardRoute;

    return (
        <AuthProvider>
            {!shouldHideLayout && <Header />}
            <main>{children}</main>
            {!shouldHideLayout && <Footer />}
            <Toaster />
            <script src="/chatbot-widget.js?v=3.0" async></script>
        </AuthProvider>
    );
}

