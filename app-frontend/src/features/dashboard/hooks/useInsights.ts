'use client';

import { fetchInsights } from '@/features/dashboard/services/insights';
import { useAsyncResource } from '@/features/dashboard/hooks/shared/useAsyncResource';
import type { InsightsResponse } from '@/types/api/dashboard';

export type InsightsData = InsightsResponse;

export interface UseInsightsResult {
  data: InsightsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInsights(businessId: string | null): UseInsightsResult {
  return useAsyncResource<InsightsResponse>({
    enabled: !!businessId,
    deps: [businessId],
    fetcher: () => fetchInsights(businessId as string),
    cacheKey: businessId ? `uplus_cache_insights_${businessId}` : undefined,
  });
}
