import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@global/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const body = await req.json();
    const { businessId, branchId, startDate, endDate } = body;

    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/analysis/run');

    const token = req.headers.get('authorization');
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    const aiResponse = await fetch(`${aiUrl}/api/v1/analysis/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({
        businessId,
        ...(branchId ? { branchId } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      }),
    });

    if (!aiResponse.ok) {
      const error = await aiResponse.text();
      return NextResponse.json(
        { error: `Error del servicio IA: ${error}` },
        { status: aiResponse.status }
      );
    }

    const result = await aiResponse.json();
    return NextResponse.json(result);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
