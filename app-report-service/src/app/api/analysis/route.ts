import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@uplus/db';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';
import { CreateAnalysisSchema, ListAnalysisQuerySchema } from '@/lib/validations/report';

export async function GET(req: NextRequest) {
  try {
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

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/analysis');

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
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = CreateAnalysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { businessId, branchId, sourceType, sourceId, sentiment, summary, keywords, periodMonth, rawPayload } = parsed.data;

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/analysis');

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
        ...(rawPayload ? { rawPayload: rawPayload as Prisma.InputJsonValue } : {}),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
