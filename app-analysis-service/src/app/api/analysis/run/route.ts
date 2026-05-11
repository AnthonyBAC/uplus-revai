import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const body: unknown = await req.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 });
    }

    const businessId = typeof body.businessId === 'string' ? body.businessId : '';
    const branchId = typeof body.branchId === 'string' ? body.branchId : undefined;
    const startDate = typeof body.startDate === 'string' ? body.startDate : undefined;
    const endDate = typeof body.endDate === 'string' ? body.endDate : undefined;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
