'use client';

import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth-client';
import { getAccessToken, getRefreshToken, saveSession, clearSession } from '@/lib/session';
import { refresh } from '@/lib/auth-client';
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
        setStatus('unauthenticated');
        return;
      }

      try {
        const data = await getSession(token) as unknown as SessionResponse;
        if (!cancelled) {
          setSession(data);
          setStatus('authenticated');
        }
      } catch {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const renewed = await refresh(refreshToken);
            saveSession(renewed.accessToken, renewed.refreshToken);
            const data = await getSession(renewed.accessToken) as unknown as SessionResponse;
            if (!cancelled) {
              setSession(data);
              setStatus('authenticated');
            }
          } catch {
            clearSession();
            if (!cancelled) setStatus('unauthenticated');
          }
        } else {
          clearSession();
          if (!cancelled) setStatus('unauthenticated');
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { status, session };
}
