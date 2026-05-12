import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabase';
import { resolveSessionResponseFromToken } from '@/lib/auth';
import type { AuthResponsePayload, RefreshInput } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<RefreshInput>;

    if (!body.refreshToken) {
      return NextResponse.json(
        { error: 'refreshToken es requerido' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAnon();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: body.refreshToken,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: error?.message ?? 'No se pudo refrescar la sesión' },
        { status: 401 }
      );
    }

    const sessionResponse = await resolveSessionResponseFromToken(
      data.session.access_token
    );

    const response: AuthResponsePayload = {
      user: sessionResponse,
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? null,
        expiresIn: data.session.expires_in ?? null,
        tokenType: data.session.token_type,
      },
      requiresEmailConfirmation: false,
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}
