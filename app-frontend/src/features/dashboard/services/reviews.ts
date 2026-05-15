import apiFetch from '@/services/http/client';
import type { DashboardReview } from '@/types/api/dashboard';

export function fetchReviews(businessId: string): Promise<DashboardReview[]> {
  return apiFetch<DashboardReview[]>(`/analysis/reviews?businessId=${businessId}`);
}
