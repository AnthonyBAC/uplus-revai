import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string };

    if (!body.email) {
      return NextResponse.json(
        { error: 'email es requerido' },
        { status: 400 }
      );
    }

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    console.log('[forgot-password] APP_URL:', process.env.APP_URL, 'NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL, 'redirectTo:', `${appUrl}/reset-password`);

    const supabase = getSupabaseAnon();
    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${appUrl}/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Si el correo existe, recibirás un enlace de recuperación.' },
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