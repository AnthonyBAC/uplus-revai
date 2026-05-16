import { z } from 'zod';

// ---------- Enums ----------

const ReviewSourceSchema = z.enum(['GOOGLE']);

const PlatformConnectionStatusSchema = z.enum([
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
