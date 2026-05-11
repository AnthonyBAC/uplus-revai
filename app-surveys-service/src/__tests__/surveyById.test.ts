import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(() =>
    Promise.resolve({ appUserId: 'user-1', supabaseUserId: 'supa-1', email: 'admin@test.com' })
  ),
  requireBusinessAccess: vi.fn(() =>
    Promise.resolve({ membershipId: 'mem-1', role: 'ADMIN' })
  ),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

vi.mock('@uplus/auth', () => mockAuth);

const mockPrisma = vi.hoisted(() => ({
  survey: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  surveyQuestion: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  surveyResponse: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET, PATCH, DELETE } from '@/app/api/surveys/[id]/route';

describe('GET /api/surveys/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar la encuesta con preguntas', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({
      id: 's1', title: 'Encuesta 1', businessId: 'biz-1', questions: [],
    });

    const res = await GET(new NextRequest('http://localhost/api/surveys/s1'), {
      params: Promise.resolve({ id: 's1' }),
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.title).toBe('Encuesta 1');
  });

  it('debe retornar 404 si no existe', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue(null);

    const res = await GET(new NextRequest('http://localhost/api/surveys/s1'), {
      params: Promise.resolve({ id: 's1' }),
    });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/surveys/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe actualizar el título', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({ id: 's1', businessId: 'biz-1' });
    mockPrisma.survey.update.mockResolvedValue({ id: 's1', title: 'Actualizado' });

    const req = new NextRequest('http://localhost/api/surveys/s1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Actualizado' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(200);
  });

  it('debe retornar 404 si no existe', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/surveys/s1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Actualizado' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/surveys/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe eliminar la encuesta', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({ id: 's1', businessId: 'biz-1' });
    mockPrisma.survey.delete.mockResolvedValue({});

    const res = await DELETE(new NextRequest('http://localhost/api/surveys/s1'), {
      params: Promise.resolve({ id: 's1' }),
    });
    expect(res.status).toBe(204);
  });
});
