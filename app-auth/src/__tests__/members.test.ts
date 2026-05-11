import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(() =>
    Promise.resolve({
      userId: 'admin-1',
      email: 'admin@test.com',
      fullName: 'Admin',
      memberships: [{ businessId: 'biz-1', role: 'ADMIN', isOwner: true, membershipId: 'mem-1', businessName: 'Negocio', businessSlug: 'negocio', hasFullBranchAccess: true, branchIds: ['b1'] }],
    })
  ),
  getBearerToken: vi.fn(() => 'fake-token'),
}));

vi.mock('@/lib/auth', () => mockAuth);

vi.mock('@/lib/permissions', () => ({
  requirePermission: vi.fn(() => Promise.resolve({ role: 'ADMIN', membershipId: 'mem-1' })),
}));

const mockPrisma = vi.hoisted(() => {
  const bm = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const uba = {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  };
  const r = {
    findUnique: vi.fn(),
  };
  const au = {
    create: vi.fn(),
  };
  const tx = { business_memberships: bm, user_branch_accesses: uba, roles: r, app_users: au };
  return { ...tx, $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)) };
});

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

vi.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    auth: {
      admin: {
        createUser: vi.fn(() =>
          Promise.resolve({ data: { user: { id: 'supa-1' } }, error: null })
        ),
      },
    },
  })),
}));

import { GET, POST } from '@/app/api/businesses/[id]/members/route';

describe('GET /api/businesses/:id/members', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar la lista de miembros', async () => {
    mockPrisma.business_memberships.findMany.mockResolvedValue([
      {
        id: 'mem-1',
        user_id: 'user-1',
        is_owner: true,
        has_full_branch_access: true,
        created_at: new Date(),
        app_users: { email: 'user@test.com', full_name: 'Test User' },
        roles: { name: 'ADMIN' },
        user_branch_accesses: [{ branch_id: 'b1' }],
      },
    ]);

    const res = await GET(new NextRequest('http://localhost/api/businesses/biz-1/members'), {
      params: Promise.resolve({ id: 'biz-1' }),
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].email).toBe('user@test.com');
    expect(body[0].role).toBe('ADMIN');
  });

  it('debe retornar 500 si prisma falla', async () => {
    mockPrisma.business_memberships.findMany.mockRejectedValue(new Error('DB error'));

    const res = await GET(new NextRequest('http://localhost/api/businesses/biz-1/members'), {
      params: Promise.resolve({ id: 'biz-1' }),
    });
    expect(res.status).toBe(500);
  });
});

describe('POST /api/businesses/:id/members', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear un trabajador y retornar 201', async () => {
    mockPrisma.roles.findUnique.mockResolvedValue({ id: 'role-trab', name: 'TRABAJADOR' });
    mockPrisma.app_users.create.mockResolvedValue({ id: 'new-user', email: 'worker@test.com', full_name: 'Worker' });
    mockPrisma.business_memberships.create.mockResolvedValue({
      id: 'mem-new',
      user_id: 'new-user',
      roles: { name: 'TRABAJADOR' },
    });

    const req = new NextRequest('http://localhost/api/businesses/biz-1/members', {
      method: 'POST',
      body: JSON.stringify({ email: 'worker@test.com', fullName: 'Worker' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'biz-1' }) });
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.email).toBe('worker@test.com');
    expect(body.role).toBe('TRABAJADOR');
  });

  it('debe retornar 400 si falta email', async () => {
    const req = new NextRequest('http://localhost/api/businesses/biz-1/members', {
      method: 'POST',
      body: JSON.stringify({ email: '', fullName: '' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'biz-1' }) });
    expect(res.status).toBe(400);
  });
});
