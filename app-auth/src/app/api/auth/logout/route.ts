import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAnon } from '@service/lib/supabase';
import { getBearerToken } from '@service/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAnon();
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}
