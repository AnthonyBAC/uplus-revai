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

vi.mock('@root/lib/auth', () => mockAuth);

const mockPrisma = vi.hoisted(() => ({
  survey: {
    findUnique: vi.fn(),
  },
  surveyQuestion: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@root/lib/prisma', () => ({ prisma: mockPrisma }));

import { GET, POST } from '@/app/api/surveys/[id]/questions/route';

describe('GET /api/surveys/:id/questions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe listar preguntas', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({ id: 's1', businessId: 'biz-1' });
    mockPrisma.surveyQuestion.findMany.mockResolvedValue([
      { id: 'q1', text: '¿Cómo?', type: 'TEXT', order: 1 },
    ]);

    const res = await GET(new NextRequest('http://localhost/api/surveys/s1/questions'), {
      params: Promise.resolve({ id: 's1' }),
    });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].text).toBe('¿Cómo?');
  });
});

describe('POST /api/surveys/:id/questions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe crear una pregunta', async () => {
    mockPrisma.survey.findUnique.mockResolvedValue({ id: 's1', businessId: 'biz-1' });
    mockPrisma.surveyQuestion.create.mockResolvedValue({
      id: 'q-new', surveyId: 's1', text: 'Nueva pregunta', type: 'RATING', order: 2,
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/questions', {
      method: 'POST',
      body: JSON.stringify({ text: 'Nueva pregunta', type: 'RATING', order: 2 }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.text).toBe('Nueva pregunta');
  });
});
