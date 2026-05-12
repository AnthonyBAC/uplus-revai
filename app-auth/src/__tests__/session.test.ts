import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockResolveSession = vi.hoisted(() => vi.fn());
const mockGetBearerToken = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth', () => ({
  getBearerToken: mockGetBearerToken,
  resolveSessionResponseFromToken: mockResolveSession,
  requireAuth: vi.fn(),
  getSupabaseUserFromToken: vi.fn(),
  getPlatformUserByEmail: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  getSupabaseAnon: vi.fn(),
  getSupabaseAdmin: vi.fn(),
}));

vi.mock('@uplus/db', () => ({ prisma: {} }));

import { GET } from '@/app/api/auth/session/route';

describe('GET /api/auth/session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBearerToken.mockReturnValue('valid-token');
    mockResolveSession.mockResolvedValue({
      authenticated: true,
      isOnboarded: true,
      supabaseUserId: 'supabase-user-1',
      appUserId: 'user-1',
      email: 'test@test.com',
      fullName: 'Test User',
      memberships: [{ role: 'ADMIN', businessId: 'biz-1' }],
    });
  });

  it('debe retornar la sesión del usuario autenticado', async () => {
    const req = new NextRequest('http://localhost/api/auth/session');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.authenticated).toBe(true);
    expect(body.isOnboarded).toBe(true);
    expect(body.email).toBe('test@test.com');
    expect(body.memberships).toHaveLength(1);
  });

  it('debe retornar 401 si el token es inválido', async () => {
    mockResolveSession.mockRejectedValue(
      Object.assign(new Error('Token inválido'), { status: 401 })
    );

    const req = new NextRequest('http://localhost/api/auth/session');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Token inválido');
  });
});
