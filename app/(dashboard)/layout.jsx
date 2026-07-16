'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Route guard: bounce unauthenticated users to onboarding.
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/signin');
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[var(--background)] md:p-3">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-96 lg:pb-0 ">
          <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">{children}</div>
        </main>
        <MobileNav />
      </div>
    </ToastProvider>
  );
}
