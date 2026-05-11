import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  endpoints: {
    findMany: vi.fn(),
  },
}));

vi.mock('@root/lib/prisma', () => ({ prisma: mockPrisma }));

import { GET } from '@/app/api/endpoints/route';

describe('GET /api/endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar endpoints con sus roles permitidos', async () => {
    mockPrisma.endpoints.findMany.mockResolvedValue([
      {
        id: '1',
        key: 'surveys.list',
        method: 'GET',
        path: '/api/surveys',
        description: 'Listar encuestas',
        role_endpoint_permissions: [
          { allowed: true, roles: { name: 'ADMIN' } },
          { allowed: true, roles: { name: 'TRABAJADOR' } },
        ],
      },
    ]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].key).toBe('surveys.list');
    expect(body[0].allowedRoles).toEqual(['ADMIN', 'TRABAJADOR']);
  });

  it('debe retornar 500 si prisma falla', async () => {
    mockPrisma.endpoints.findMany.mockRejectedValue(new Error('DB error'));

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
