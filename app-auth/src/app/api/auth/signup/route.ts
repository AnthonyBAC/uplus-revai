import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { getSupabaseAnon } from '@/lib/supabase';
import { resolveSessionResponseFromToken } from '@/lib/auth';
import type { AuthResponsePayload, SignupInput } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SignupInput>;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'email y password son requeridos' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAnon();
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: body.fullName ? { full_name: body.fullName } : undefined,
      },
    });

    if (error) {
      const status =
        error.message.toLowerCase().includes('already') ||
        error.message.toLowerCase().includes('registered')
          ? 409
          : 400;

      return NextResponse.json({ error: error.message }, { status });
    }

    let appUserId: string | null = null;

    if (data.user?.email) {
      const existing = await prisma.app_users.findUnique({
        where: { email: data.user.email },
        select: { id: true },
      });

      if (!existing) {
        const created = await prisma.app_users.create({
          data: {
            id: crypto.randomUUID(),
            email: data.user.email,
            full_name: body.fullName ?? null,
            updated_at: new Date(),
          },
          select: { id: true },
        });
        appUserId = created.id;
      } else {
        appUserId = existing.id;
      }
    }

    const sessionResponse = data.session?.access_token
      ? await resolveSessionResponseFromToken(data.session.access_token)
        : data.user
        ? {
            authenticated: false,
            isOnboarded: false,
            supabaseUserId: data.user.id,
            appUserId,
            email: data.user.email ?? body.email,
            fullName:
              typeof data.user.user_metadata?.full_name === 'string'
                ? data.user.user_metadata.full_name
                : body.fullName ?? null,
            memberships: [],
          }
        : null;

    const response: AuthResponsePayload = {
      user: sessionResponse ?? {
        authenticated: false,
        isOnboarded: false,
        supabaseUserId: '',
        appUserId,
        email: body.email,
        fullName: body.fullName ?? null,
        memberships: [],
      },
      session: data.session
        ? {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at ?? null,
            expiresIn: data.session.expires_in ?? null,
            tokenType: data.session.token_type,
          }
        : null,
      requiresEmailConfirmation: !data.session,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}
