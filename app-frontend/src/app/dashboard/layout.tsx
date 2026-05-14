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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--color-bg-cream, #f5f0eb)', color: 'var(--color-text-secondary, #888)', fontSize: 14 }}>
        Cargando…
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
