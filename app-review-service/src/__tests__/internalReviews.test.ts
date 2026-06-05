import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockPrisma = vi.hoisted(() => ({
  review: { findMany: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET } from '@/app/api/internal/reviews/route';

describe('GET /api/internal/reviews', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 400 si businessId no es UUID valido', async () => {
    const req = new NextRequest('http://localhost/api/internal/reviews?businessId=not-uuid');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('debe retornar 200 con reviews filtradas por businessId', async () => {
    mockPrisma.review.findMany.mockResolvedValue([
      { id: 'r1', businessId: 'biz-1', rating: 5, content: 'Buena' },
    ]);

    const req = new NextRequest('http://localhost/api/internal/reviews?businessId=550e8400-e29b-41d4-a716-446655440000');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('r1');
  });

  it('debe retornar 400 si branchId no es UUID valido', async () => {
    const req = new NextRequest('http://localhost/api/internal/reviews?businessId=550e8400-e29b-41d4-a716-446655440000&branchId=not-uuid');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('debe retornar 200 con reviews filtradas por branchId y rango de fechas', async () => {
    mockPrisma.review.findMany.mockResolvedValue([
      { id: 'r2', businessId: 'biz-1', branchId: '550e8400-e29b-41d4-a716-446655440001', rating: 4 },
    ]);

    const req = new NextRequest('http://localhost/api/internal/reviews?businessId=550e8400-e29b-41d4-a716-446655440000&branchId=550e8400-e29b-41d4-a716-446655440001&startDate=2026-01-01T00:00:00.000Z&endDate=2026-12-31T23:59:59.999Z');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.items).toHaveLength(1);
  });

  it('debe retornar 200 con reviews sin filtros opcionales', async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);

    const req = new NextRequest('http://localhost/api/internal/reviews?businessId=550e8400-e29b-41d4-a716-446655440000');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.items).toHaveLength(0);
  });
});