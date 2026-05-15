'use client';

import { useReducer, useEffect } from 'react';
import { fetchReviews } from '@/services/analysis/reviews';
import type { DashboardReview } from '@/types/api/dashboard';

export interface UseReviewsResult {
  data: DashboardReview[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

type State = { data: DashboardReview[] | null; loading: boolean; error: string | null; tick: number };
type Action =
  | { type: 'fetch' }
  | { type: 'success'; data: DashboardReview[] }
  | { type: 'error'; error: string }
  | { type: 'refetch' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'fetch': return { ...state, loading: true, error: null };
    case 'success': return { ...state, loading: false, data: action.data };
    case 'error': return { ...state, loading: false, error: action.error };
    case 'refetch': return { ...state, tick: state.tick + 1 };
  }
}

export function useReviews(businessId: string | null): UseReviewsResult {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: !!businessId, error: null, tick: 0 });

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    dispatch({ type: 'fetch' });

    fetchReviews(businessId)
      .then((d) => { if (!cancelled) dispatch({ type: 'success', data: d }); })
      .catch((e: Error) => { if (!cancelled) dispatch({ type: 'error', error: e.message }); });

    return () => { cancelled = true; };
  }, [businessId, state.tick]);

  return { data: state.data, loading: state.loading, error: state.error, refetch: () => dispatch({ type: 'refetch' }) };
}