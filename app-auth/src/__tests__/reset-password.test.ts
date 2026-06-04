import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase', () => ({
  getSupabaseAnon: vi.fn(),
}));

import { POST } from '@/app/api/auth/reset-password/route';

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta accessToken o newPassword', async () => {
    const req1 = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword: 'newpass123' }),
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);
    expect(await res1.json()).toEqual({ error: 'accessToken y newPassword son requeridos' });

    const req2 = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ accessToken: 'token123' }),
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);
    expect(await res2.json()).toEqual({ error: 'accessToken y newPassword son requeridos' });
  });

  it('debe retornar 401 si el token de sesion es invalido', async () => {
    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue({
      auth: {
        setSession: vi.fn().mockResolvedValue({ error: { message: 'Invalid refresh token' } }),
      },
    });

    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ accessToken: 'bad-token', newPassword: 'newpass123' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Token de recuperación inválido o expirado' });
  });

  it('debe retornar 400 si updateUser falla', async () => {
    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue({
      auth: {
        setSession: vi.fn().mockResolvedValue({ error: null }),
        updateUser: vi.fn().mockResolvedValue({ error: { message: 'Password too weak' } }),
      },
    });

    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ accessToken: 'valid-token', newPassword: 'weak' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Password too weak' });
  });

  it('debe retornar 200 si la contrasena se actualiza correctamente', async () => {
    const { getSupabaseAnon } = await import('@/lib/supabase');
    vi.mocked(getSupabaseAnon).mockReturnValue({
      auth: {
        setSession: vi.fn().mockResolvedValue({ error: null }),
        updateUser: vi.fn().mockResolvedValue({ error: null }),
      },
    });

    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ accessToken: 'valid-token', newPassword: 'SecurePass123!' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Contraseña actualizada correctamente.' });
  });
});