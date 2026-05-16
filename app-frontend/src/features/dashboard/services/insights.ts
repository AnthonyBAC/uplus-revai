import apiFetch from '@/services/http/client';
import type { InsightsResponse } from '@/types/api/dashboard';

export function fetchInsights(businessId: string): Promise<InsightsResponse> {
  return apiFetch<InsightsResponse>(`/analysis/insights?businessId=${businessId}`);
}
