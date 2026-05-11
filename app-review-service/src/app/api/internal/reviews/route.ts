import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';
import { InternalReviewsQuerySchema } from '@/lib/validations/review';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const parsed = InternalReviewsQuerySchema.safeParse({
      businessId: searchParams.get('businessId'),
      branchId: searchParams.get('branchId') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { businessId, branchId, startDate, endDate } = parsed.data;

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/internal/reviews');

    const reviews = await prisma.review.findMany({
      where: {
        businessId,
        ...(branchId ? { branchId } : {}),
        ...(startDate || endDate
          ? {
              publishedAt: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
              },
            }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        businessId: true,
        branchId: true,
        source: true,
        externalId: true,
        authorName: true,
        rating: true,
        content: true,
        language: true,
        publishedAt: true,
        fetchedAt: true,
      },
    });

    return NextResponse.json({ items: reviews });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
