export interface Review {
  id: string;
  businessId: string;
  branchId?: string | null;
  connectionId: string;
  source: string;
  externalId: string;
  authorName?: string | null;
  authorExternalId?: string | null;
  rating: number;
  content: string;
  language?: string | null;
  publishedAt: string;
  fetchedAt: string;
  reply?: string | null;
}
