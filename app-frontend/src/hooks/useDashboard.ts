'use client';

import { useReducer, useEffect } from 'react';
import { fetchDashboard } from '@/services/analysis/dashboard';
import type { DashboardResponse } from '@/types/api/dashboard';

export interface UseDashboardResult {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

type State = { data: DashboardResponse | null; loading: boolean; error: string | null; tick: number };
type Action =
  | { type: 'fetch' }
  | { type: 'success'; data: DashboardResponse }
  | { type: 'error'; error: string }
  | { type: 'refetch' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'fetch':   return { ...state, loading: true, error: null };
    case 'success': return { ...state, loading: false, data: action.data };
    case 'error':   return { ...state, loading: false, error: action.error };
    case 'refetch': return { ...state, tick: state.tick + 1 };
  }
}

export function useDashboard(businessId: string | null): UseDashboardResult {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: !!businessId, error: null, tick: 0 });

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    dispatch({ type: 'fetch' });

    fetchDashboard(businessId)
      .then((d) => { if (!cancelled) dispatch({ type: 'success', data: d }); })
      .catch((e: Error) => { if (!cancelled) dispatch({ type: 'error', error: e.message }); });

    return () => { cancelled = true; };
  }, [businessId, state.tick]);

  return { data: state.data, loading: state.loading, error: state.error, refetch: () => dispatch({ type: 'refetch' }) };
}
