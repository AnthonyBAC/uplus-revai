import { z } from 'zod';

// ---------- Enums ----------

export const ReviewSourceSchema = z.enum(['GOOGLE']);

export const ReviewSyncStatusSchema = z.enum([
  'PENDING',
  'RUNNING',
  'SUCCESS',
  'FAILED',
]);

export const PlatformConnectionStatusSchema = z.enum([
  'ACTIVE',
  'EXPIRED',
  'REVOKED',
]);

// ---------- BusinessPlatformConnection ----------

export const CreateConnectionSchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  source: ReviewSourceSchema,
  externalAccountId: z.string().min(1),
  externalLocationId: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenExpiresAt: z.iso.datetime(),
});

export const UpdateConnectionSchema = z.object({
  status: PlatformConnectionStatusSchema.optional(),
  accessToken: z.string().min(1).optional(),
  refreshToken: z.string().min(1).optional(),
  tokenExpiresAt: z.iso.datetime().optional(),
});

// ---------- Review ----------

export const CreateReviewSchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  connectionId: z.string().uuid(),
  source: ReviewSourceSchema,
  externalId: z.string().min(1),
  authorName: z.string().optional(),
  authorExternalId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  language: z.string().optional(),
  publishedAt: z.iso.datetime(),
  rawPayload: z.record(z.string(), z.unknown()),
});

export const ListReviewsQuerySchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  source: ReviewSourceSchema.optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});

// ---------- Internal ----------

export const InternalReviewsQuerySchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

// ---------- ReviewSyncJob ----------

export const CreateSyncJobSchema = z.object({
  connectionId: z.string().uuid(),
  triggeredBy: z.string().uuid().optional(),
});

// ---------- Types ----------

export type CreateConnectionInput = z.infer<typeof CreateConnectionSchema>;
export type UpdateConnectionInput = z.infer<typeof UpdateConnectionSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type ListReviewsQuery = z.infer<typeof ListReviewsQuerySchema>;
export type InternalReviewsQuery = z.infer<typeof InternalReviewsQuerySchema>;
export type CreateSyncJobInput = z.infer<typeof CreateSyncJobSchema>;
