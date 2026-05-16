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
    await requireEndpointPermission(role, 'GET', '/api/analysis/reviews');

    const token = req.headers.get('authorization');
    const reviewUrl = process.env.REVIEW_SERVICE_URL || 'http://localhost:3003';
    const upstream = await fetch(`${reviewUrl}/api/reviews${req.nextUrl.search}`, {
      headers: token ? { Authorization: token } : {},
    });

    const responseBody = await upstream.text();
    return new NextResponse(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
