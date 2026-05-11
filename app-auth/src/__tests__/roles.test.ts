import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  roles: {
    findMany: vi.fn(),
  },
}));

vi.mock('@root/lib/prisma', () => ({ prisma: mockPrisma }));

import { GET } from '@/app/api/roles/route';

describe('GET /api/roles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar la lista de roles con can_login=true', async () => {
    mockPrisma.roles.findMany.mockResolvedValue([
      { name: 'ADMIN', description: 'Dueño' },
      { name: 'TRABAJADOR', description: 'Empleado' },
    ]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({ name: 'ADMIN', description: 'Dueño' });
  });

  it('debe retornar 500 si prisma falla', async () => {
    mockPrisma.roles.findMany.mockRejectedValue(new Error('DB error'));

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
