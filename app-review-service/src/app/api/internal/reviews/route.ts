import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { InternalReviewsQuerySchema } from '@/lib/validations/review';

// Valida el token de servicio interno
function isAuthorized(req: NextRequest): boolean {
  const token = process.env.INTERNAL_SERVICE_TOKEN;
  const header = req.headers.get('authorization') ?? '';
  if (!token) return false;
  return header === `Bearer ${token}`;
}

// GET /api/internal/reviews
// Consumido por app-ai-service. Requiere Authorization: Bearer <INTERNAL_SERVICE_TOKEN>
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;

  const parsed = InternalReviewsQuerySchema.safeParse({
    businessId: searchParams.get('businessId'),
    branchId: searchParams.get('branchId') ?? undefined,
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { businessId, branchId, startDate, endDate } = parsed.data;

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
}
