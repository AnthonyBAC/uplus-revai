'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { BusinessProvider } from '@/components/dashboard/BusinessContext';
import DashboardShell from '@/components/dashboard/shell/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status, session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated' && session && !session.isOnboarded) {
      router.replace('/onboarding');
    }
  }, [status, session, router]);

  if (status === 'loading' || !session || !session.isOnboarded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        background: 'var(--color-bg-cream, #f5f0eb)',
        gap: 16,
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid var(--color-border-default, #e0dcd7)',
          borderTopColor: 'var(--color-accent-primary, #e85d3a)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-secondary, #888)' }}>
          Cargando…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <BusinessProvider memberships={session.memberships}>
      <DashboardShell session={session}>
        {children}
      </DashboardShell>
    </BusinessProvider>
  );
}
