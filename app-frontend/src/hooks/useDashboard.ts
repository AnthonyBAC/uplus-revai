'use client';

import { useState, useEffect } from 'react';
import { fetchDashboard } from '@/services/analysis/dashboard';
import type { DashboardResponse } from '@/types/api/dashboard';

export interface UseDashboardResult {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(businessId: string | null): UseDashboardResult {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDashboard(businessId)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [businessId, tick]);

  return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}
