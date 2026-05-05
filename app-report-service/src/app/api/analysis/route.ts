import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';
import { CreateAnalysisSchema, ListAnalysisQuerySchema } from '@/lib/validations/report';

// GET /api/analysis?businessId=xxx&branchId=xxx&sourceType=REVIEW&sentiment=POSITIVE
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = ListAnalysisQuerySchema.safeParse({
    businessId: searchParams.get('businessId'),
    branchId: searchParams.get('branchId') ?? undefined,
    sourceType: searchParams.get('sourceType') ?? undefined,
    sentiment: searchParams.get('sentiment') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { businessId, branchId, sourceType, sentiment } = parsed.data;

  const results = await prisma.analysisResult.findMany({
    where: {
      businessId,
      ...(branchId ? { branchId } : {}),
      ...(sourceType ? { sourceType } : {}),
      ...(sentiment ? { sentiment } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(results);
}

// POST /api/analysis — requiere Authorization: Bearer <INTERNAL_SERVICE_TOKEN>
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateAnalysisSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { businessId, branchId, sourceType, sourceId, sentiment, summary, keywords, periodMonth, rawPayload } = parsed.data;

  const result = await prisma.analysisResult.create({
    data: {
      businessId,
      ...(branchId ? { branchId } : {}),
      sourceType,
      sourceId,
      sentiment,
      summary,
      keywords,
      ...(periodMonth ? { periodMonth: new Date(periodMonth) } : {}),
      ...(rawPayload ? { rawPayload } : {}),
    },
  });

  return NextResponse.json(result, { status: 201 });
}
