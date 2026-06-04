import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockPrisma = vi.hoisted(() => ({
  businessPlatformConnection: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET, PATCH, DELETE } from '@/app/api/connections/[id]/route';

describe('GET /api/connections/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 404 si la conexion no existe', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/connections/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Conexión no encontrada' });
  });

  it('debe retornar 200 con la conexion y sus syncJobs', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue({
      id: 'c1',
      businessId: 'biz-1',
      source: 'GOOGLE',
      syncJobs: [{ id: 'job1', status: 'COMPLETED' }],
    });

    const req = new NextRequest('http://localhost/api/connections/c1');
    const res = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.id).toBe('c1');
    expect(body.syncJobs).toHaveLength(1);
  });
});

describe('PATCH /api/connections/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 404 si la conexion no existe', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/connections/nonexistent', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });

  it('debe retornar 422 si el body no es valido', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue({
      id: 'c1',
      businessId: 'biz-1',
      source: 'GOOGLE',
    });

    const req = new NextRequest('http://localhost/api/connections/c1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'INVALID_STATUS' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(res.status).toBe(422);
  });

  it('debe retornar 200 al actualizar la conexion', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue({
      id: 'c1',
      businessId: 'biz-1',
      source: 'GOOGLE',
      status: 'INACTIVE',
    });
    mockPrisma.businessPlatformConnection.update.mockResolvedValue({
      id: 'c1',
      businessId: 'biz-1',
      source: 'GOOGLE',
      status: 'ACTIVE',
    });

    const req = new NextRequest('http://localhost/api/connections/c1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ACTIVE');
  });
});

describe('DELETE /api/connections/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar 404 si la conexion no existe', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/connections/nonexistent', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });

  it('debe retornar 204 al eliminar la conexion', async () => {
    mockPrisma.businessPlatformConnection.findUnique.mockResolvedValue({
      id: 'c1',
      businessId: 'biz-1',
      source: 'GOOGLE',
    });
    mockPrisma.businessPlatformConnection.delete.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/connections/c1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(res.status).toBe(204);
  });
});