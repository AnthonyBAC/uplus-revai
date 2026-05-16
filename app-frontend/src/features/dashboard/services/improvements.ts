import apiFetch from '@/services/http/client';
import type { ImprovementsResponse } from '@/types/api/dashboard';

export function fetchImprovements(businessId: string): Promise<ImprovementsResponse> {
  return apiFetch<ImprovementsResponse>(`/analysis/improvements?businessId=${businessId}`);
}
