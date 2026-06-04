import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/db', () => ({ prisma: { app_users: { findUnique: vi.fn(), create: vi.fn() } } }));

vi.mock('@/lib/supabase', () => ({
  getSupabaseAnon: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  resolveSessionResponseFromToken: vi.fn(),
}));

import { POST } from '@/app/api/auth/signup/route';

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta email o password', async () => {
    const req1 = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ password: '123456' }),
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);
    expect(await res1.json()).toEqual({ error: 'email y password son requeridos' });

    const req2 = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);
    expect(await res2.json()).toEqual({ error: 'email y password son requeridos' });
  });

  it('debe crear usuario y retornar 201 con session', async () => {
    const mockSupabase = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: {
            user: { id: 'supa-1', email: 'new@test.com', user_metadata: { full_name: 'New User' } },
            session: { access_token: 'token-123', refresh_token: 'refresh-123', expires_at: 123456, expires_in: 3600, token_type: 'bearer' },
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
      email: 'new@test.com',
      fullName: 'New User',
      memberships: [{ role: 'ADMIN', businessId: 'biz-1' }],
    });

    const { prisma } = await import('@uplus/db');
    vi.mocked(prisma.app_users.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.app_users.create).mockResolvedValue({ id: 'app-user-1', email: 'new@test.com' });

    const req = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@test.com', password: '123456', fullName: 'New User' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.user.authenticated).toBe(true);
    expect(body.session.accessToken).toBe('token-123');
    expect(body.requiresEmailConfirmation).toBe(false);
  });

  it('debe retornar 409 si el email ya existe', async () => {
    const mockSupabase = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'User already registered' },
        }),
      },
    };

    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@test.com', password: '123456' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: 'User already registered' });
  });

  it('debe retornar 400 si Supabase devuelve otro error', async () => {
    const mockSupabase = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Invalid email format' },
        }),
      },
    };

    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'bad@test.com', password: '123456' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid email format' });
  });

  it('debe retornar 201 con requiresEmailConfirmation si no hay sesion', async () => {
    const mockSupabase = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: {
            user: { id: 'supa-1', email: 'pending@test.com', user_metadata: {} },
            session: null,
          },
          error: null,
        }),
      },
    };

    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue(mockSupabase);

    const { prisma } = await import('@uplus/db');
    vi.mocked(prisma.app_users.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.app_users.create).mockResolvedValue({ id: 'app-user-1', email: 'pending@test.com' });

    const req = new NextRequest('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'pending@test.com', password: '123456' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.requiresEmailConfirmation).toBe(true);
    expect(body.session).toBe(null);
  });
});