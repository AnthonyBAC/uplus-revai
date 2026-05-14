'use client';

import { useState, useEffect } from 'react';
import { fetchReviews } from '@/services/reviews/list';
import type { Review } from '@/types/api/reviews';

export interface UseReviewsResult {
  data: Review[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReviews(businessId: string | null): UseReviewsResult {
  const [data, setData] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchReviews({ businessId })
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [businessId, tick]);

  return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}
