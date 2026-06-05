import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase', () => ({
  getSupabaseAnon: vi.fn(),
}));

import { POST } from '@/app/api/auth/forgot-password/route';

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta email', async () => {
    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'email es requerido' });
  });

  it('debe retornar 200 si el email existe (aunque Supabase no de error)', async () => {
    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue({
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      },
    });

    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@test.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Si el correo existe, recibirás un enlace de recuperación.' });
  });

  it('debe retornar 400 si Supabase devuelve error', async () => {
    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue({
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: { message: 'Email not found' } }),
      },
    });

    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'notfound@test.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Email not found' });
  });
});