import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(() =>
    Promise.resolve({
      userId: 'user-1',
      email: 'owner@test.com',
      fullName: 'Owner',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', membershipId: 'mem-1' }],
    })
  ),
}));

vi.mock('@/lib/auth', () => mockAuth);

const mockPrisma = vi.hoisted(() => {
  const au = { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() };
  const biz = { findUnique: vi.fn(), create: vi.fn() };
  const br = { create: vi.fn() };
  const bm = { create: vi.fn() };
  const uba = { create: vi.fn() };
  const r = { findUnique: vi.fn() };
  return {
    app_users: au,
    businesses: biz,
    branches: br,
    business_memberships: bm,
    user_branch_accesses: uba,
    roles: r,
    $transaction: vi.fn((fn) => fn({
      app_users: au,
      businesses: biz,
      branches: br,
      business_memberships: bm,
      user_branch_accesses: uba,
      roles: r,
    })),
  };
});

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si faltan campos requeridos', async () => {
    const req1 = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ businessName: 'My Business', businessSlug: 'mybiz' }),
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(400);

    const req2 = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Owner', businessSlug: 'mybiz' }),
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);

    const req3 = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Owner', businessName: 'My Business' }),
    });
    const res3 = await POST(req3);
    expect(res3.status).toBe(400);
  });

  it('debe retornar 500 si el rol ADMIN no existe', async () => {
    mockPrisma.roles.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Owner', businessName: 'My Business', businessSlug: 'mybiz' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Rol ADMIN no encontrado. Ejecuta el seed primero.' });
  });

  it('debe retornar 201 y crear negocio, sucursal y membresia', async () => {
    mockPrisma.roles.findUnique.mockResolvedValue({ id: 'role-admin', name: 'ADMIN' });
    mockPrisma.app_users.findUnique.mockResolvedValue(null);
    mockPrisma.app_users.create.mockResolvedValue({ id: 'user-new', email: 'owner@test.com' });
    mockPrisma.businesses.findUnique.mockResolvedValue(null);
    mockPrisma.businesses.create.mockResolvedValue({ id: 'biz-new', name: 'My Business', slug: 'mybiz' });
    mockPrisma.branches.create.mockResolvedValue({ id: 'branch-new', name: 'Principal' });
    mockPrisma.business_memberships.create.mockResolvedValue({ id: 'mem-new', user_id: 'user-new', business_id: 'biz-new' });
    mockPrisma.user_branch_accesses.create.mockResolvedValue({ id: 'uba-new' });

    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Owner', businessName: 'My Business', businessSlug: 'mybiz' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.userId).toBe('user-new');
    expect(body.businessId).toBe('biz-new');
    expect(body.businessSlug).toBe('mybiz');
    expect(body.branchId).toBe('branch-new');
  });

  it('debe generar slug unico si el negocio ya existe', async () => {
    mockPrisma.roles.findUnique.mockResolvedValue({ id: 'role-admin', name: 'ADMIN' });
    mockPrisma.app_users.findUnique.mockResolvedValue(null);
    mockPrisma.app_users.create.mockResolvedValue({ id: 'user-new', email: 'owner@test.com' });
    mockPrisma.businesses.findUnique
      .mockResolvedValueOnce({ id: 'existing-biz', slug: 'mybiz' })
      .mockResolvedValueOnce(null);
    mockPrisma.businesses.create.mockResolvedValue({ id: 'biz-new', name: 'My Business', slug: 'mybiz-ab12' });
    mockPrisma.branches.create.mockResolvedValue({ id: 'branch-new', name: 'Principal' });
    mockPrisma.business_memberships.create.mockResolvedValue({ id: 'mem-new' });
    mockPrisma.user_branch_accesses.create.mockResolvedValue({ id: 'uba-new' });

    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Owner', businessName: 'My Business', businessSlug: 'mybiz' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.businessSlug).toBe('mybiz-ab12');
  });
});