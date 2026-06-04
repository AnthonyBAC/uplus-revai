import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  getBearerToken: vi.fn(),
}));

import { POST } from '@/app/api/auth/logout/route';

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 200 si no hay token (logout sin sesion)', async () => {
    const { getBearerToken } = await import('@/lib/auth');
    vi.mocked(getBearerToken).mockReturnValue(null);

    const req = new NextRequest('http://localhost/api/auth/logout', { method: 'POST' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('debe retornar 200 si el logout es exitoso', async () => {
    const { getBearerToken } = await import('@/lib/auth');
    const { getSupabaseAdmin } = await import('@/lib/supabase');

    vi.mocked(getBearerToken).mockReturnValue('valid-token');
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        admin: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      },
    });

    const req = new NextRequest('http://localhost/api/auth/logout', { method: 'POST' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('debe retornar 400 si Supabase devuelve error al hacer signOut', async () => {
    const { getBearerToken } = await import('@/lib/auth');
    const { getSupabaseAdmin } = await import('@/lib/supabase');

    vi.mocked(getBearerToken).mockReturnValue('invalid-token');
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      auth: {
        admin: {
          signOut: vi.fn().mockResolvedValue({ error: { message: 'Token expired' } }),
        },
      },
    });

    const req = new NextRequest('http://localhost/api/auth/logout', { method: 'POST' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Token expired' });
  });
});