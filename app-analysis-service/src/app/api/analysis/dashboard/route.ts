import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const businessId = req.nextUrl.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/analysis/dashboard');

    const token = req.headers.get('authorization');
    const reviewUrl = process.env.REVIEW_SERVICE_URL || 'http://localhost:3003';
    const surveyUrl = process.env.SURVEYS_SERVICE_URL || 'http://localhost:3005';
    const reportUrl = process.env.REPORT_SERVICE_URL || 'http://localhost:3004';

    const [reviewsRes, surveysRes, reportsRes] = await Promise.all([
      fetch(`${reviewUrl}/api/reviews?businessId=${businessId}`, {
        headers: token ? { Authorization: token } : {},
      }),
      fetch(`${surveyUrl}/api/surveys?businessId=${businessId}`, {
        headers: token ? { Authorization: token } : {},
      }),
      fetch(`${reportUrl}/api/reports?businessId=${businessId}`, {
        headers: token ? { Authorization: token } : {},
      }),
    ]);

    const [reviews, surveys, reports] = await Promise.all([
      reviewsRes.ok ? reviewsRes.json() : [],
      surveysRes.ok ? surveysRes.json() : [],
      reportsRes.ok ? reportsRes.json() : [],
    ]);

    return NextResponse.json({
      businessId,
      reviews: Array.isArray(reviews) ? reviews.length : 0,
      surveys: Array.isArray(surveys) ? surveys.length : 0,
      reports: Array.isArray(reports) ? reports.length : 0,
      data: {
        reviews: Array.isArray(reviews) ? reviews.slice(0, 5) : [],
        surveys: Array.isArray(surveys) ? surveys.slice(0, 5) : [],
        reports: Array.isArray(reports) ? reports.slice(0, 5) : [],
      },
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}