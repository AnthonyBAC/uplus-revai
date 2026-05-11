import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockAuth = vi.hoisted(() => ({
  requireAuth: vi.fn(() =>
    Promise.resolve({ appUserId: 'user-1', supabaseUserId: 'supa-1', email: 'trabajador@test.com' })
  ),
  requireBusinessAccess: vi.fn(() =>
    Promise.resolve({ membershipId: 'mem-1', role: 'TRABAJADOR' })
  ),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

vi.mock('@service/lib/auth', () => mockAuth);

const mockPrisma = vi.hoisted(() => ({
  survey: {
    findUnique: vi.fn(),
  },
  surveyResponse: {
    create: vi.fn(),
  },
}));

vi.mock('@root/lib/prisma', () => ({ prisma: mockPrisma }));

import { POST } from '@/app/api/surveys/[id]/respond/route';

describe('POST /api/surveys/:id/respond', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe registrar una respuesta con capturedByUserId del token', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({
      id: 's1',
      isActive: true,
      businessId: '550e8400-e29b-41d4-a716-446655440000',
      questions: [{ id: '660e8400-e29b-41d4-a716-446655440000', text: 'Como?', type: 'TEXT', order: 1 }],
    });
    mockPrisma.surveyResponse.create.mockResolvedValue({
      id: 'r1',
      surveyId: 's1',
      capturedByUserId: 'user-1',
      answers: [{ id: 'a1', questionId: 'q1', value: 'Bien' }],
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/respond', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        answers: [{ questionId: '660e8400-e29b-41d4-a716-446655440000', value: 'Bien' }],
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.capturedByUserId).toBe('user-1');
  });

  it('debe retornar 409 si la encuesta no esta activa', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({
      id: 's1',
      isActive: false,
      businessId: 'biz-1',
      questions: [],
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/respond', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        answers: [{ questionId: '660e8400-e29b-41d4-a716-446655440000', value: 'Bien' }],
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(409);
  });

  it('debe retornar 404 si la encuesta no existe', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/surveys/s1/respond', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        answers: [{ questionId: '660e8400-e29b-41d4-a716-446655440000', value: 'Bien' }],
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(404);
  });
});
