import apiFetch from '@/services/http/client';

export interface BusinessData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface BranchData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export function fetchBusiness(businessId: string): Promise<BusinessData> {
  return apiFetch<BusinessData>(`/auth/businesses/${businessId}`);
}

export function fetchBranches(businessId: string): Promise<BranchData[]> {
  return apiFetch<BranchData[]>(`/auth/branches?businessId=${businessId}`);
}
