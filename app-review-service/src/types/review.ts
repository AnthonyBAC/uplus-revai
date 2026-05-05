// Tipos compartidos del dominio review

export type ReviewSource = 'GOOGLE';
export type ReviewSyncStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
export type PlatformConnectionStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface ReviewItem {
  id: string;
  businessId: string;
  branchId: string | null;
  connectionId: string;
  source: ReviewSource;
  externalId: string;
  authorName: string | null;
  authorExternalId: string | null;
  rating: number;
  content: string;
  language: string | null;
  publishedAt: Date;
  fetchedAt: Date;
  createdAt: Date;
}

export interface ConnectionItem {
  id: string;
  businessId: string;
  branchId: string | null;
  source: ReviewSource;
  externalAccountId: string;
  externalLocationId: string;
  status: PlatformConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncJobItem {
  id: string;
  connectionId: string;
  businessId: string;
  branchId: string | null;
  status: ReviewSyncStatus;
  startedAt: Date | null;
  finishedAt: Date | null;
  reviewsFetched: number;
  reviewsNew: number;
  errorMessage: string | null;
  createdAt: Date;
}
