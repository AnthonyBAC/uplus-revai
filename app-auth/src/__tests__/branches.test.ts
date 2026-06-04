import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(() =>
    Promise.resolve({
      userId: 'admin-1',
      email: 'admin@test.com',
      fullName: 'Admin',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', membershipId: 'mem-1', hasFullBranchAccess: true }],
    })
  ),
}));

vi.mock('@/lib/auth', () => mockAuth);

vi.mock('@/lib/permissions', () => ({
  requirePermission: vi.fn(() => Promise.resolve({ role: 'ADMIN', membershipId: 'mem-1' })),
}));

const mockPrisma = vi.hoisted(() => ({
  branches: { findMany: vi.fn(), create: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET, POST } from '@/app/api/branches/route';

describe('GET /api/branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta businessId', async () => {
    const req = new NextRequest('http://localhost/api/branches');
    const res = await GET(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'businessId es requerido' });
  });

  it('debe retornar 200 con lista de branches', async () => {
    mockPrisma.branches.findMany.mockResolvedValue([
      { id: 'b1', name: 'Branch 1', slug: 'branch-1', is_active: true, businesses: { name: 'My Biz' } },
      { id: 'b2', name: 'Branch 2', slug: 'branch-2', is_active: true, businesses: { name: 'My Biz' } },
    ]);

    const req = new NextRequest('http://localhost/api/branches?businessId=biz-1');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe('Branch 1');
  });

  it('debe retornar branches para trabajador con acceso limitado', async () => {
    mockAuth.requireAuth.mockResolvedValue({
      userId: 'worker-1',
      email: 'worker@test.com',
      fullName: 'Worker',
      memberships: [{ businessId: 'biz-1', role: 'TRABAJADOR', membershipId: 'mem-1', hasFullBranchAccess: false }],
    });

    mockPrisma.branches.findMany.mockResolvedValue([
      { id: 'b1', name: 'My Branch', slug: 'my-branch', is_active: true, businesses: { name: 'My Biz' } },
    ]);

    const req = new NextRequest('http://localhost/api/branches?businessId=biz-1');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(1);
  });
});

describe('POST /api/branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta businessId, name o slug', async () => {
    const req1 = new NextRequest('http://localhost/api/branches', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Branch', slug: 'new-branch' }),
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);

    const req2 = new NextRequest('http://localhost/api/branches', {
      method: 'POST',
      body: JSON.stringify({ businessId: 'biz-1', slug: 'new-branch' }),
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);

    const req3 = new NextRequest('http://localhost/api/branches', {
      method: 'POST',
      body: JSON.stringify({ businessId: 'biz-1', name: 'New Branch' }),
    });
    const res3 = await POST(req3);
    expect(res3.status).toBe(400);
  });

  it('debe retornar 500 si el body no es JSON valido', async () => {
    const req = new NextRequest('http://localhost/api/branches', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('debe retornar 201 al crear una branch exitosamente', async () => {
    mockPrisma.branches.create.mockResolvedValue({
      id: 'b-new',
      name: 'New Branch',
      slug: 'new-branch',
      businesses: { name: 'My Biz' },
    });

    const req = new NextRequest('http://localhost/api/branches', {
      method: 'POST',
      body: JSON.stringify({ businessId: 'biz-1', name: 'New Branch', slug: 'new-branch' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe('b-new');
    expect(body.name).toBe('New Branch');
    expect(body.slug).toBe('new-branch');
  });
});