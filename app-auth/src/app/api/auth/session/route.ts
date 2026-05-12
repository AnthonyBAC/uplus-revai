import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, resolveSessionResponseFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const session = await resolveSessionResponseFromToken(token);

    return NextResponse.json(session);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}
