import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockPrisma = vi.hoisted(() => ({
  reviewSyncJob: { findUnique: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET } from '@/app/api/sync/[id]/route';

describe('GET /api/sync/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 404 si el job no existe', async () => {
    mockPrisma.reviewSyncJob.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/sync/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Job no encontrado' });
  });

  it('debe retornar 200 con el job y su conexion', async () => {
    mockPrisma.reviewSyncJob.findUnique.mockResolvedValue({
      id: 'job1',
      businessId: 'biz-1',
      status: 'COMPLETED',
      connection: {
        id: 'c1',
        source: 'GOOGLE',
        externalLocationId: 'loc1',
        status: 'ACTIVE',
      },
    });

    const req = new NextRequest('http://localhost/api/sync/job1');
    const res = await GET(req, { params: Promise.resolve({ id: 'job1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.id).toBe('job1');
    expect(body.status).toBe('COMPLETED');
    expect(body.connection.source).toBe('GOOGLE');
  });
});