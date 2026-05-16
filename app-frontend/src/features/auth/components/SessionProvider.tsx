'use client';

import { createContext, use } from 'react';
import { useSession, type UseSessionResult } from '@/features/auth/hooks/useSession';

const SessionContext = createContext<UseSessionResult | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSessionContext(): UseSessionResult {
  const session = use(SessionContext);

  if (!session) {
    throw new Error('useSessionContext debe usarse dentro de SessionProvider');
  }

  return session;
}
