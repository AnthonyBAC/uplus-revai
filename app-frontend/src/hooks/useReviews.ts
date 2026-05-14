'use client';

import type { DashboardReview } from '@/types/api/dashboard';

export interface UseReviewsResult {
  data: DashboardReview[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReviews(): UseReviewsResult {
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => {},
  };
}
