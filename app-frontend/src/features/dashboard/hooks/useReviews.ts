'use client';

import { fetchReviews } from '@/features/dashboard/services/reviews';
import { useAsyncResource } from '@/features/dashboard/hooks/shared/useAsyncResource';
import type { DashboardReview } from '@/types/api/dashboard';

export interface UseReviewsResult {
  data: DashboardReview[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReviews(businessId: string | null): UseReviewsResult {
  return useAsyncResource<DashboardReview[]>({
    enabled: !!businessId,
    deps: [businessId],
    fetcher: () => fetchReviews(businessId as string),
    cacheKey: businessId ? `uplus_cache_reviews_${businessId}` : undefined,
  });
}
