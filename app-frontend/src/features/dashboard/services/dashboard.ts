import apiFetch from '@/services/http/client';
import type { DashboardResponse } from '@/types/api/dashboard';

export function fetchDashboard(businessId: string): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>(`/analysis/dashboard?businessId=${businessId}`);
}
