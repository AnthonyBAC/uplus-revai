import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      accessToken?: string;
      refreshToken?: string;
      newPassword?: string;
    };

    if (!body.accessToken || !body.newPassword) {
      return NextResponse.json(
        { error: 'accessToken y newPassword son requeridos' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAnon();

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: body.accessToken,
      refresh_token: body.refreshToken ?? '',
    });

    if (sessionError) {
      return NextResponse.json(
        { error: 'Token de recuperación inválido o expirado' },
        { status: 401 }
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: body.newPassword,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente.' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}