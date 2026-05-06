import { z } from 'zod';

const ReportStatusSchema = z.enum(['PENDING', 'READY', 'FAILED']);
const SentimentSchema = z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']);
const AnalysisSourceTypeSchema = z.enum(['REVIEW', 'SURVEY']);

// GET /api/reports
export const ListReportsQuerySchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  status: ReportStatusSchema.optional(),
});

// POST /api/reports
export const CreateReportSchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  title: z.string().min(1),
  periodStart: z.iso.datetime(),
  periodEnd: z.iso.datetime(),
});

// PATCH /api/reports/:id
export const UpdateReportSchema = z.object({
  status: ReportStatusSchema.optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  generatedAt: z.iso.datetime().optional(),
});

// GET /api/analysis
export const ListAnalysisQuerySchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  sourceType: AnalysisSourceTypeSchema.optional(),
  sentiment: SentimentSchema.optional(),
});

// POST /api/analysis
export const CreateAnalysisSchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  sourceType: AnalysisSourceTypeSchema,
  sourceId: z.string().uuid(),
  sentiment: SentimentSchema,
  summary: z.string().min(1),
  keywords: z.array(z.string()).optional().default([]),
  periodMonth: z.iso.datetime().optional(),
  rawPayload: z.record(z.string(), z.unknown()).optional(),
});
