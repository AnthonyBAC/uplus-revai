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
  survey: { findUnique: vi.fn() },
  surveyResponse: { findMany: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { GET } from '@/app/api/surveys/[id]/responses/route';

describe('GET /api/surveys/:id/responses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 404 si la encuesta no existe', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/surveys/nonexistent/responses');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Encuesta no encontrada' });
  });

  it('debe retornar 401 si auth falla', async () => {
    mockAuth.requireAuth.mockRejectedValueOnce(Object.assign(new Error('No autorizado'), { status: 401 }));

    const req = new NextRequest('http://localhost/api/surveys/s1/responses');
    const res = await GET(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(401);
  });

  it('debe retornar 200 con las respuestas de la encuesta', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({
      id: 's1',
      businessId: 'biz-1',
      title: 'Encuesta 1',
    });
    mockPrisma.surveyResponse.findMany.mockResolvedValue([
      {
        id: 'r1',
        surveyId: 's1',
        capturedByUserId: 'user-1',
        createdAt: new Date(),
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            value: 'Muy bueno',
            question: { id: 'q1', text: '¿Cómo estuvo?', type: 'TEXT' },
          },
        ],
      },
    ]);

    const req = new NextRequest('http://localhost/api/surveys/s1/responses');
    const res = await GET(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe('r1');
    expect(body[0].answers[0].value).toBe('Muy bueno');
  });

  it('debe retornar 200 con array vacio si no hay respuestas', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({
      id: 's1',
      businessId: 'biz-1',
      title: 'Encuesta 1',
    });
    mockPrisma.surveyResponse.findMany.mockResolvedValue([]);

    const req = new NextRequest('http://localhost/api/surveys/s1/responses');
    const res = await GET(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(0);
  });
});