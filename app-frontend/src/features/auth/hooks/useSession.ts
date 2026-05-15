'use client';

import { useEffect, useState } from 'react';
import apiFetch from '@/services/http/client';
import { getAccessToken, clearSession } from '@/features/auth/lib/session';
import type { SessionResponse } from '@/types/api/session';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UseSessionResult {
  status: SessionStatus;
  session: SessionResponse | null;
}

export function useSession(): UseSessionResult {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [session, setSession] = useState<SessionResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) setStatus('unauthenticated');
        return;
      }

      try {
        const data = await apiFetch<SessionResponse>('/auth/session', {
          skipRedirect: true,
        });
        if (!cancelled) {
          setSession(data);
          setStatus('authenticated');
        }
      } catch {
        clearSession();
        if (!cancelled) setStatus('unauthenticated');
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { status, session };
}
