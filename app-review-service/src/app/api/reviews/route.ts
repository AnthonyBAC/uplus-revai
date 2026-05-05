import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ListReviewsQuerySchema } from '@/lib/validations/review';

// GET /api/reviews?businessId=xxx&branchId=xxx&from=xxx&to=xxx&rating=x&source=GOOGLE
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = ListReviewsQuerySchema.safeParse({
    businessId: searchParams.get('businessId'),
    branchId: searchParams.get('branchId') ?? undefined,
    source: searchParams.get('source') ?? undefined,
    rating: searchParams.get('rating') ?? undefined,
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { businessId, branchId, source, rating, from, to } = parsed.data;

  const reviews = await prisma.review.findMany({
    where: {
      businessId,
      ...(branchId ? { branchId } : {}),
      ...(source ? { source } : {}),
      ...(rating ? { rating } : {}),
      ...(from || to
        ? {
            publishedAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json(reviews);
}
