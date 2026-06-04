import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(() =>
    Promise.resolve({
      userId: 'admin-1',
      email: 'admin@test.com',
      fullName: 'Admin',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', membershipId: 'mem-1' }],
    })
  ),
}));

vi.mock('@/lib/auth', () => mockAuth);

vi.mock('@/lib/permissions', () => ({
  requirePermission: vi.fn(() => Promise.resolve({ role: 'ADMIN', membershipId: 'mem-1' })),
}));

const mockPrisma = vi.hoisted(() => {
  const bm = { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const uba = { deleteMany: vi.fn(), createMany: vi.fn() };
  const r = { findUnique: vi.fn() };
  return {
    business_memberships: bm,
    user_branch_accesses: uba,
    roles: r,
  };
});

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { PATCH, DELETE } from '@/app/api/businesses/[id]/members/[userId]/route';

describe('PATCH /api/businesses/:id/members/:userId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 500 si el body no es JSON valido', async () => {
    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(500);
  });

  it('debe retornar 404 si el miembro no existe', async () => {
    mockPrisma.business_memberships.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Miembro no encontrado' });
  });

  it('debe retornar 400 si el rol no existe', async () => {
    mockPrisma.business_memberships.findUnique.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      roles: { name: 'TRABAJADOR' },
    });
    mockPrisma.roles.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'NONEXISTENT' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Rol NONEXISTENT no encontrado' });
  });

  it('debe retornar 200 al actualizar el rol del miembro', async () => {
    mockPrisma.business_memberships.findUnique.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      is_active: true,
      has_full_branch_access: false,
      roles: { name: 'TRABAJADOR' },
      user_branch_accesses: [],
    });
    mockPrisma.roles.findUnique.mockResolvedValue({ id: 'role-admin', name: 'ADMIN' });
    mockPrisma.business_memberships.update.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      is_active: true,
      has_full_branch_access: false,
      roles: { name: 'ADMIN' },
      user_branch_accesses: [],
    });

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'ADMIN' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.role).toBe('ADMIN');
  });

  it('debe retornar 200 al actualizar isActive y hasFullBranchAccess', async () => {
    mockPrisma.business_memberships.findUnique.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      is_active: true,
      has_full_branch_access: false,
      roles: { name: 'TRABAJADOR' },
      user_branch_accesses: [],
    });
    mockPrisma.business_memberships.update.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      is_active: false,
      has_full_branch_access: true,
      roles: { name: 'TRABAJADOR' },
      user_branch_accesses: [],
    });

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false, hasFullBranchAccess: true }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isActive).toBe(false);
    expect(body.hasFullBranchAccess).toBe(true);
  });

  it('debe actualizar branchIds y reemplazar accesos', async () => {
    mockPrisma.business_memberships.findUnique.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      is_active: true,
      has_full_branch_access: false,
      roles: { name: 'TRABAJADOR' },
      user_branch_accesses: [{ branch_id: 'old-branch' }],
    });
    mockPrisma.business_memberships.update.mockResolvedValue({
      id: 'mem-1',
      user_id: 'user-1',
      business_id: 'biz-1',
      is_active: true,
      has_full_branch_access: false,
      roles: { name: 'TRABAJADOR' },
      user_branch_accesses: [{ branch_id: 'new-branch-1' }, { branch_id: 'new-branch-2' }],
    });

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', {
      method: 'PATCH',
      body: JSON.stringify({ branchIds: ['new-branch-1', 'new-branch-2'] }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.branchIds).toEqual(['new-branch-1', 'new-branch-2']);
    expect(mockPrisma.user_branch_accesses.deleteMany).toHaveBeenCalledWith({
      where: { user_id: 'user-1', business_id: 'biz-1' },
    });
    expect(mockPrisma.user_branch_accesses.createMany).toHaveBeenCalled();
  });
});

describe('DELETE /api/businesses/:id/members/:userId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 200 al eliminar un miembro', async () => {
    mockPrisma.business_memberships.delete.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members/user-1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'biz-1', userId: 'user-1' }) });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});