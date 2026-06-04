import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockPrisma = vi.hoisted(() => ({
  review: { findUnique: vi.fn(), delete: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET, DELETE } from '@/app/api/reviews/[id]/route';

describe('GET /api/reviews/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 404 si la review no existe', async () => {
    mockPrisma.review.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/reviews/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Reseña no encontrada' });
  });

  it('debe retornar 401 si auth falla', async () => {
    const { requireAuth } = await import('@uplus/auth');
    vi.mocked(requireAuth).mockRejectedValueOnce(Object.assign(new Error('No auth'), { status: 401 }));

    const req = new NextRequest('http://localhost/api/reviews/r1');
    const res = await GET(req, { params: Promise.resolve({ id: 'r1' }) });
    expect(res.status).toBe(401);
  });

  it('debe retornar 200 con la review', async () => {
    mockPrisma.review.findUnique.mockResolvedValue({
      id: 'r1',
      businessId: 'biz-1',
      content: 'Buena review',
      rating: 5,
    });

    const req = new NextRequest('http://localhost/api/reviews/r1');
    const res = await GET(req, { params: Promise.resolve({ id: 'r1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.id).toBe('r1');
    expect(body.content).toBe('Buena review');
  });
});

describe('DELETE /api/reviews/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 404 si la review no existe', async () => {
    mockPrisma.review.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/reviews/nonexistent', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Reseña no encontrada' });
  });

  it('debe retornar 204 al eliminar la review', async () => {
    mockPrisma.review.findUnique.mockResolvedValue({
      id: 'r1',
      businessId: 'biz-1',
      content: 'Review',
      rating: 4,
    });
    mockPrisma.review.delete.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/reviews/r1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'r1' }) });
    expect(res.status).toBe(204);
  });
});