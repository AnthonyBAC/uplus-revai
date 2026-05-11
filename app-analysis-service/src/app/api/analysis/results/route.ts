import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@service/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const businessId = req.nextUrl.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/analysis/results');

    const token = req.headers.get('authorization');
    const reportUrl = process.env.REPORT_SERVICE_URL || 'http://localhost:3004';
    const params = new URLSearchParams({ businessId });

    const sourceType = req.nextUrl.searchParams.get('sourceType');
    const sentiment = req.nextUrl.searchParams.get('sentiment');
    if (sourceType) params.set('sourceType', sourceType);
    if (sentiment) params.set('sentiment', sentiment);

    const response = await fetch(`${reportUrl}/api/analysis?${params}`, {
      headers: token ? { Authorization: token } : {},
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al consultar análisis' },
        { status: response.status }
      );
    }

    const results = await response.json();
    return NextResponse.json(results);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
