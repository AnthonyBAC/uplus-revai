import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/lib/auth', () => mockAuth);

vi.mock('@/lib/permissions', () => ({
  requirePermission: vi.fn(() => Promise.resolve({ role: 'ADMIN', membershipId: 'mem-1' })),
}));

const mockPrisma = vi.hoisted(() => ({
  branches: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET, PATCH, DELETE } from '@/app/api/branches/[id]/route';

describe('GET /api/branches/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.requireAuth.mockResolvedValue({
      userId: 'admin-1',
      email: 'admin@test.com',
      fullName: 'Admin',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', membershipId: 'mem-1' }],
    });
  });

  it('debe retornar 200 con la branch si existe', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue({
      id: 'b1',
      business_id: 'biz-1',
      name: 'Branch 1',
      slug: 'branch-1',
      description: 'A branch',
      is_active: true,
    });

    const req = new NextRequest('http://localhost/api/branches/b1');
    const res = await GET(req, { params: Promise.resolve({ id: 'b1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.id).toBe('b1');
    expect(body.name).toBe('Branch 1');
  });

  it('debe retornar 404 si la branch no existe', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/branches/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Sucursal no encontrada' });
  });
});

describe('PATCH /api/branches/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.requireAuth.mockResolvedValue({
      userId: 'admin-1',
      email: 'admin@test.com',
      fullName: 'Admin',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', membershipId: 'mem-1' }],
    });
  });

  it('debe retornar 404 si la branch no existe', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/branches/nonexistent', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });

  it('debe retornar 200 al actualizar la branch', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue({
      id: 'b1',
      business_id: 'biz-1',
      name: 'Old Name',
      slug: 'old-slug',
      description: null,
      is_active: true,
    });
    mockPrisma.branches.update.mockResolvedValue({
      id: 'b1',
      business_id: 'biz-1',
      name: 'Updated Name',
      slug: 'updated-slug',
      description: 'New desc',
      is_active: true,
    });

    const req = new NextRequest('http://localhost/api/branches/b1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated Name', slug: 'Updated Slug', description: 'New desc', isActive: true }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Updated Name');
  });

  it('debe retornar 500 si el body no es JSON valido', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue({
      id: 'b1',
      business_id: 'biz-1',
      name: 'Branch',
      slug: 'branch',
      description: null,
      is_active: true,
    });

    const req = new NextRequest('http://localhost/api/branches/b1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 'b1' }) });
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/branches/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.requireAuth.mockResolvedValue({
      userId: 'admin-1',
      email: 'admin@test.com',
      fullName: 'Admin',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', membershipId: 'mem-1' }],
    });
  });

  it('debe retornar 404 si la branch no existe', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/branches/nonexistent', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });

  it('debe retornar 200 al eliminar la branch', async () => {
    mockPrisma.branches.findUnique.mockResolvedValue({
      id: 'b1',
      business_id: 'biz-1',
      name: 'Branch',
      slug: 'branch',
      description: null,
      is_active: true,
    });
    mockPrisma.branches.delete.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/branches/b1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'b1' }) });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});