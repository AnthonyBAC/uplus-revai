import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

type AnalysisSentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

type ReviewItem = {
  rating: number;
  publishedAt: string;
};

type AnalysisResultItem = {
  keywords: string[];
  sentiment: AnalysisSentiment;
  createdAt: string;
};

type ThemeSummary = {
  name: string;
  sentiment: 'positivo' | 'negativo' | 'neutro';
  mentions: number;
  trend: number;
};

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const businessId = req.nextUrl.searchParams.get('businessId');
    const branchId = req.nextUrl.searchParams.get('branchId') ?? undefined;

    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/analysis/insights');

    const token = req.headers.get('authorization');
    const reviewUrl = process.env.REVIEW_SERVICE_URL || 'http://localhost:3003';
    const reportUrl = process.env.REPORT_SERVICE_URL || 'http://localhost:3004';
    const query = buildBusinessQuery(businessId, branchId);

    const [reviewsResponse, analysisResponse] = await Promise.all([
      fetch(`${reviewUrl}/api/reviews?${query}`, {
        headers: token ? { Authorization: token } : {},
      }),
      fetch(`${reportUrl}/api/analysis?${query}`, {
        headers: token ? { Authorization: token } : {},
      }),
    ]);

    if (!reviewsResponse.ok) {
      return NextResponse.json(
        { error: 'Error al consultar reseñas para insights' },
        { status: reviewsResponse.status }
      );
    }

    if (!analysisResponse.ok) {
      return NextResponse.json(
        { error: 'Error al consultar análisis para insights' },
        { status: analysisResponse.status }
      );
    }

    const [reviews, analysisResults] = await Promise.all([
      reviewsResponse.json() as Promise<ReviewItem[]>,
      analysisResponse.json() as Promise<AnalysisResultItem[]>,
    ]);

    return NextResponse.json({
      businessId,
      ...(branchId ? { branchId } : {}),
      ratingTrend: buildRatingTrend(reviews),
      volumeTrend: buildVolumeTrend(reviews),
      themes: buildThemes(analysisResults),
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

function buildBusinessQuery(businessId: string, branchId?: string): string {
  const query = new URLSearchParams({ businessId });
  if (branchId) query.set('branchId', branchId);
  return query.toString();
}

function buildRatingTrend(reviews: ReviewItem[]): number[] {
  return buildMonthBuckets(reviews, (bucket, review) => {
    bucket.total += review.rating;
    bucket.count += 1;
  }).map((bucket) => (bucket.count > 0 ? Number((bucket.total / bucket.count).toFixed(1)) : 0));
}

function buildVolumeTrend(reviews: ReviewItem[]): number[] {
  return buildMonthBuckets(reviews, (bucket) => {
    bucket.count += 1;
  }).map((bucket) => bucket.count);
}

function buildMonthBuckets(
  reviews: ReviewItem[],
  apply: (bucket: { total: number; count: number }, review: ReviewItem) => void
): Array<{ total: number; count: number }> {
  const bucketCount = 6;
  const today = new Date();
  const buckets = Array.from({ length: bucketCount }, () => ({ total: 0, count: 0 }));

  const monthKeys = Array.from({ length: bucketCount }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (bucketCount - 1 - index), 1);
    return `${date.getFullYear()}-${date.getMonth()}`;
  });

  const keyToIndex = new Map(monthKeys.map((key, index) => [key, index]));

  for (const review of reviews) {
    const date = new Date(review.publishedAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const index = keyToIndex.get(key);
    if (index === undefined) continue;
    apply(buckets[index], review);
  }

  return buckets;
}

function buildThemes(results: AnalysisResultItem[]): ThemeSummary[] {
  const recentThreshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const previousThreshold = Date.now() - 60 * 24 * 60 * 60 * 1000;
  const themes = new Map<string, {
    label: string;
    mentions: number;
    positive: number;
    negative: number;
    neutral: number;
    recent: number;
    previous: number;
  }>();

  for (const result of results) {
    const createdAt = new Date(result.createdAt).getTime();
    for (const keyword of result.keywords) {
      const normalized = normalizeKeyword(keyword);
      if (!normalized) continue;

      const current = themes.get(normalized) ?? {
        label: keyword.trim(),
        mentions: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        recent: 0,
        previous: 0,
      };

      current.mentions += 1;
      if (result.sentiment === 'POSITIVE') current.positive += 1;
      if (result.sentiment === 'NEGATIVE') current.negative += 1;
      if (result.sentiment === 'NEUTRAL') current.neutral += 1;

      if (!Number.isNaN(createdAt)) {
        if (createdAt >= recentThreshold) current.recent += 1;
        else if (createdAt >= previousThreshold) current.previous += 1;
      }

      themes.set(normalized, current);
    }
  }

  return Array.from(themes.values())
    .sort((a, b) => b.mentions - a.mentions || b.negative - a.negative || a.label.localeCompare(b.label))
    .slice(0, 6)
    .map((theme) => ({
      name: theme.label,
      sentiment: resolveThemeSentiment(theme),
      mentions: theme.mentions,
      trend: theme.recent - theme.previous,
    }));
}

function normalizeKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

function resolveThemeSentiment(theme: {
  positive: number;
  negative: number;
  neutral: number;
}): 'positivo' | 'negativo' | 'neutro' {
  if (theme.negative > theme.positive && theme.negative >= theme.neutral) return 'negativo';
  if (theme.positive > theme.negative && theme.positive >= theme.neutral) return 'positivo';
  return 'neutro';
}
