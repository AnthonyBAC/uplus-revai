'use client';

import { useEffect, useReducer } from 'react';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  tick: number;
};

type AsyncAction<T> =
  | { type: 'fetch' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: string }
  | { type: 'refetch' };

function reducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'fetch':
      return { ...state, loading: true, error: null };
    case 'success':
      return { ...state, loading: false, data: action.data };
    case 'error':
      return { ...state, loading: false, error: action.error };
    case 'refetch':
      return { ...state, tick: state.tick + 1 };
    default:
      return state;
  }
}

export interface UseAsyncResourceOptions<T> {
  enabled: boolean;
  deps: Array<string | null | undefined | number | boolean>;
  fetcher: () => Promise<T>;
  cacheKey?: string;
}

export interface UseAsyncResourceResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAsyncResource<T>(options: UseAsyncResourceOptions<T>): UseAsyncResourceResult<T> {
  const { enabled, deps, fetcher, cacheKey } = options;
  const depsKey = deps.map((value) => String(value ?? '')).join('|');

  const [state, dispatch] = useReducer(reducer<T>, {
    data: null,
    loading: enabled,
    error: null,
    tick: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    if (cacheKey && state.tick === 0) {
      const cached = readCache<T>(cacheKey);
      if (cached !== null) {
        dispatch({ type: 'success', data: cached });
        return;
      }
    }

    let cancelled = false;
    dispatch({ type: 'fetch' });

    fetcher()
      .then((data) => {
        if (!cancelled) {
          if (cacheKey) writeCache(cacheKey, data);
          dispatch({ type: 'success', data });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) dispatch({ type: 'error', error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, state.tick, cacheKey, fetcher, depsKey]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: () => dispatch({ type: 'refetch' }),
  };
}

function readCache<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(cacheKey);
    return null;
  }
}

function writeCache<T>(cacheKey: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable, ignore safely
  }
}
