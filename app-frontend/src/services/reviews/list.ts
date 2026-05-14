import apiFetch from '@/services/http/client';
import type { Review } from '@/types/api/reviews';

export interface ReviewsParams {
  businessId: string;
  branchId?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

export function fetchReviews(params: ReviewsParams): Promise<Review[]> {
  const query = new URLSearchParams({ businessId: params.businessId });
  if (params.branchId) query.set('branchId', params.branchId);
  if (params.source) query.set('source', params.source);
  if (params.limit != null) query.set('limit', String(params.limit));
  if (params.offset != null) query.set('offset', String(params.offset));
  return apiFetch<Review[]>(`/review/reviews?${query.toString()}`);
}
