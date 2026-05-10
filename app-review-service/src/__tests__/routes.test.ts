import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@global/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'user-1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockPrisma = vi.hoisted(() => ({
  review: { findMany: vi.fn() },
  businessPlatformConnection: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  reviewSyncJob: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
}));

vi.mock('@global/prisma', () => ({ prisma: mockPrisma }));

import { GET } from '@/app/api/reviews/route';
import { GET as getConnections, POST as postConnections } from '@/app/api/connections/route';
import { GET as getSync, POST as postSync } from '@/app/api/sync/route';

describe('GET /api/reviews', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar reviews filtradas', async () => {
    mockPrisma.review.findMany.mockResolvedValue([{ id: 'r1', content: 'Bueno', rating: 5 }]);
    const res = await GET(new NextRequest('http://localhost/api/reviews?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it('debe retornar 400 si la validación falla', async () => {
    const res = await GET(new NextRequest('http://localhost/api/reviews'));
    expect(res.status).toBe(400);
  });
});

describe('GET /api/connections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar conexiones', async () => {
    mockPrisma.businessPlatformConnection.findMany.mockResolvedValue([]);
    const res = await getConnections(new NextRequest('http://localhost/api/connections?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);
  });

  it('debe retornar 400 sin businessId', async () => {
    const res = await getConnections(new NextRequest('http://localhost/api/connections'));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/connections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe crear conexión', async () => {
    mockPrisma.businessPlatformConnection.create.mockResolvedValue({ id: 'c1' });
    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        source: 'GOOGLE',
        externalAccountId: 'acc1',
        externalLocationId: 'loc1',
        accessToken: 'tok',
        refreshToken: 'ref',
        tokenExpiresAt: '2026-01-01T00:00:00Z',
      }),
    });
    const res = await postConnections(req);
    expect(res.status).toBe(201);
  });
});

describe('GET /api/sync', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar jobs', async () => {
    mockPrisma.reviewSyncJob.findMany.mockResolvedValue([]);
    const res = await getSync(new NextRequest('http://localhost/api/sync?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);
  });

  it('debe retornar 400 sin businessId', async () => {
    const res = await getSync(new NextRequest('http://localhost/api/sync'));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/sync', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe crear job de sync', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue({
      id: 'conn1', businessId: '550e8400-e29b-41d4-a716-446655440000', branchId: null,
    });
    mockPrisma.reviewSyncJob.create.mockResolvedValue({ id: 'job1', status: 'PENDING' });
    const req = new NextRequest('http://localhost/api/sync', {
      method: 'POST',
      body: JSON.stringify({ connectionId: '660e8400-e29b-41d4-a716-446655440000' }),
    });
    const res = await postSync(req);
    expect(res.status).toBe(201);
  });
});
