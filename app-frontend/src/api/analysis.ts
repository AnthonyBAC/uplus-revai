import { api } from "./client";

export type Analysis = {
  id: string;
  businessId: string;
  branchId: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  trends: string[];
  createdAt: string;
};

export const analysisApi = {
  getAll: (businessId: string, params?: Record<string, string>) =>
    api.get<{ data: Analysis[] }>(`/analysis/business/${businessId}`, params),

  getById: (id: string) =>
    api.get<Analysis>(`/analysis/${id}`),
};