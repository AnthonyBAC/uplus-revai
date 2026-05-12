import { api } from "./client";

export type Review = {
  id: string;
  platform: string;
  rating: number;
  text: string;
  author: string;
  date: string;
  businessId: string;
  branchId: string;
};

export type ReviewsParams = {
  businessId: string;
  branchId?: string;
  platform?: string;
  rating?: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export const reviewsApi = {
  getAll: (params: ReviewsParams) =>
    api.get<{ data: Review[]; total: number }>("/reviews", params),

  getById: (id: string) =>
    api.get<Review>(`/reviews/${id}`),
};
