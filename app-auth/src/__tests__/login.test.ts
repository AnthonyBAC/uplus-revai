import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase', () => ({
  getSupabaseAnon: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  resolveSessionResponseFromToken: vi.fn(),
}));

import { POST } from '@/app/api/auth/login/route';

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta email o password', async () => {
    const req1 = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: '123456' }),
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);
    expect(await res1.json()).toEqual({ error: 'email y password son requeridos' });

    const req2 = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);
    expect(await res2.json()).toEqual({ error: 'email y password son requeridos' });
  });

  it('debe retornar 401 si las credenciales son invalidas', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'Invalid login credentials' },
        }),
      },
    };

    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'bad@test.com', password: 'wrong' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Invalid login credentials' });
  });

  it('debe retornar 401 si no hay sesion aunque no haya error', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    };

    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: '123456' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'No se pudo iniciar sesión' });
  });

  it('debe retornar 200 con session si el login es exitoso', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: {
            session: {
              access_token: 'token-login',
              refresh_token: 'refresh-login',
              expires_at: 123456,
              expires_in: 3600,
              token_type: 'bearer',
            },
          },
          error: null,
        }),
      },
    };

    const { getSupabaseAnon } = await import('@/lib/supabase');
    const { resolveSessionResponseFromToken } = await import('@/lib/auth');

    vi.mocked(getSupabaseAnon).mockReturnValue(mockSupabase);
    vi.mocked(resolveSessionResponseFromToken).mockResolvedValue({
      authenticated: true,
      isOnboarded: true,
      supabaseUserId: 'supa-1',
      appUserId: 'app-user-1',
      email: 'logged@test.com',
      fullName: 'Logged User',
      memberships: [{ role: 'ADMIN', businessId: 'biz-1' }],
    });

    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'logged@test.com', password: 'correcto' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.authenticated).toBe(true);
    expect(body.session.accessToken).toBe('token-login');
    expect(body.requiresEmailConfirmation).toBe(false);
  });
});