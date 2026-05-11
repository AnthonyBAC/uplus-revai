import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuthModule = vi.hoisted(() => ({
  requireAuth: vi.fn(),
}));

let mockAuthResult: object | Error = {
  userId: 'user-1',
  email: 'test@test.com',
  fullName: 'Test User',
  memberships: [],
};

vi.mock('@service/lib/auth', () => ({
  requireAuth: mockAuthModule.requireAuth.mockImplementation(() => {
    if (mockAuthResult instanceof Error) throw mockAuthResult;
    return Promise.resolve(mockAuthResult);
  }),
}));

vi.mock('@root/lib/prisma', () => ({ prisma: {} }));

import { GET } from '@/app/api/auth/session/route';

describe('GET /api/auth/session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthResult = {
      userId: 'user-1',
      email: 'test@test.com',
      fullName: 'Test User',
      memberships: [{ role: 'ADMIN', businessId: 'biz-1' }],
    };
  });

  it('debe retornar la sesión del usuario autenticado', async () => {
    const req = new NextRequest('http://localhost/api/auth/session');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.userId).toBe('user-1');
    expect(body.email).toBe('test@test.com');
    expect(body.memberships).toHaveLength(1);
  });

  it('debe retornar 401 si el token es inválido', async () => {
    mockAuthResult = Object.assign(new Error('Token inválido'), { status: 401 });

    const req = new NextRequest('http://localhost/api/auth/session');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Token inválido');
  });
});
