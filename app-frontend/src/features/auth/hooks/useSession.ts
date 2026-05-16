'use client';

import { useEffect, useReducer } from 'react';
import apiFetch from '@/services/http/client';
import { getAccessToken, getSavedSession, clearSession } from '@/features/auth/lib/session';
import type { SessionResponse } from '@/types/api/session';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UseSessionResult {
  status: SessionStatus;
  session: SessionResponse | null;
}

type SessionState = UseSessionResult;

type SessionAction =
  | { type: 'authenticated'; session: SessionResponse }
  | { type: 'unauthenticated' };

function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'authenticated':
      return { status: 'authenticated', session: action.session };
    case 'unauthenticated':
      return { status: 'unauthenticated', session: null };
    default:
      return state;
  }
}

export function useSession(): UseSessionResult {
  const [state, dispatch] = useReducer(reducer, {
    status: 'loading' as SessionStatus,
    session: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) dispatch({ type: 'unauthenticated' });
        return;
      }

      const cachedSession = getSavedSession();
      if (cachedSession) {
        if (!cancelled) dispatch({ type: 'authenticated', session: cachedSession });
        return;
      }

      try {
        const data = await apiFetch<SessionResponse>('/auth/session', {
          skipRedirect: true,
        });
        if (!cancelled) dispatch({ type: 'authenticated', session: data });
      } catch {
        clearSession();
        if (!cancelled) dispatch({ type: 'unauthenticated' });
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
