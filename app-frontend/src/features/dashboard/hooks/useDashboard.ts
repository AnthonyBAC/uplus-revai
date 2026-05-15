'use client';

import { fetchDashboard } from '@/features/dashboard/services/dashboard';
import { useAsyncResource } from '@/features/dashboard/hooks/shared/useAsyncResource';
import type { DashboardResponse } from '@/types/api/dashboard';

export interface UseDashboardResult {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(businessId: string | null): UseDashboardResult {
  return useAsyncResource<DashboardResponse>({
    enabled: !!businessId,
    deps: [businessId],
    fetcher: () => fetchDashboard(businessId as string),
    cacheKey: businessId ? `uplus_cache_dashboard_${businessId}` : undefined,
  });
}
