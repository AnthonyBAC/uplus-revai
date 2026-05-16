import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

type AnalysisSentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

type ReviewItem = {
  rating: number;
};

type AnalysisResultItem = {
  keywords: string[];
  sentiment: AnalysisSentiment;
  createdAt: string;
};

type ImprovementAction = {
  id: string;
  title: string;
  why: string;
  impact: 'alto' | 'medio' | 'bajo';
  steps: number;
  eta: string;
  status: 'sugerida';
  progress: number;
  tag: string;
  detail: string[];
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
    await requireEndpointPermission(role, 'GET', '/api/analysis/improvements');

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
        { error: 'Error al consultar reseñas para mejoras' },
        { status: reviewsResponse.status }
      );
    }

    if (!analysisResponse.ok) {
      return NextResponse.json(
        { error: 'Error al consultar análisis para mejoras' },
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
      totalReviews: reviews.length,
      actions: buildActions(analysisResults),
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

function buildActions(results: AnalysisResultItem[]): ImprovementAction[] {
  const recentThreshold = Date.now() - 45 * 24 * 60 * 60 * 1000;
  const themes = new Map<string, { label: string; mentions: number; recentMentions: number }>();

  for (const result of results) {
    if (result.sentiment !== 'NEGATIVE') continue;

    const createdAt = new Date(result.createdAt).getTime();
    for (const keyword of result.keywords) {
      const normalized = keyword.trim().toLowerCase();
      if (!normalized) continue;

      const current = themes.get(normalized) ?? {
        label: keyword.trim(),
        mentions: 0,
        recentMentions: 0,
      };

      current.mentions += 1;
      if (!Number.isNaN(createdAt) && createdAt >= recentThreshold) {
        current.recentMentions += 1;
      }
      themes.set(normalized, current);
    }
  }

  return Array.from(themes.entries())
    .sort((a, b) => b[1].mentions - a[1].mentions || b[1].recentMentions - a[1].recentMentions)
    .slice(0, 5)
    .map(([normalized, theme], index) => toAction(normalized, theme, index));
}

function toAction(
  normalized: string,
  theme: { label: string; mentions: number; recentMentions: number },
  index: number
): ImprovementAction {
  const impact = theme.mentions >= 5 || theme.recentMentions >= 3
    ? 'alto'
    : theme.mentions >= 3
      ? 'medio'
      : 'bajo';

  return {
    id: `improvement-${normalized.replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
    title: `Mejorar ${theme.label.toLowerCase()}`,
    why: `${theme.mentions} análisis recientes mencionan ${theme.label.toLowerCase()} con tono negativo.`,
    impact,
    steps: 3,
    eta: impact === 'alto' ? '2 semanas' : '1 semana',
    status: 'sugerida',
    progress: 0,
    tag: theme.label,
    detail: [
      `Revisa reseñas recientes asociadas a "${theme.label}" y detecta patrón común.`,
      `Define cambio operativo concreto para mejorar ${theme.label.toLowerCase()} en negocio o sucursal afectada.`,
      `Mide durante las próximas 2 semanas si bajan menciones negativas sobre ${theme.label.toLowerCase()}.`,
    ],
  };
}
