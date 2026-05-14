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
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        fontFamily: 'var(--font-ui)',
        color: 'var(--ink-mute)',
        fontSize: 14,
      }}>
        Cargando…
      </div>
    );
  }

  if (!session) return null;

  return (
    <BusinessProvider memberships={session.memberships}>
      <DashboardShell session={session}>
        {children}
      </DashboardShell>
    </BusinessProvider>
  );
}
