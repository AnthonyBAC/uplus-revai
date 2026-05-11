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

const mockPrisma = vi.hoisted(() => {
  const fn = vi.fn();
  return {
    survey: {
      findMany: fn,
      findUnique: fn,
      create: fn,
      update: fn,
      delete: fn,
    },
    surveyQuestion: {
      findMany: fn,
      findUnique: fn,
      create: fn,
      update: fn,
      delete: fn,
    },
    surveyResponse: {
      findMany: fn,
      findUnique: fn,
      create: fn,
    },
  };
});

vi.mock('@root/lib/prisma', () => ({ prisma: mockPrisma }));

import { GET, POST } from '@/app/api/surveys/route';

describe('GET /api/surveys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 400 si falta businessId', async () => {
    const req = new NextRequest('http://localhost/api/surveys');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('debe retornar surveys con preguntas', async () => {
    mockPrisma.survey.findMany.mockResolvedValue([
      { id: 's1', title: 'Encuesta 1', businessId: 'biz-1', questions: [] },
    ]);

    const req = new NextRequest('http://localhost/api/surveys?businessId=biz-1');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Encuesta 1');
  });

  it('debe retornar 500 si auth falla', async () => {
    mockAuth.requireAuth.mockRejectedValueOnce(Object.assign(new Error('Token inválido'), { status: 401 }));

    const req = new NextRequest('http://localhost/api/surveys?businessId=biz-1');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/surveys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear una encuesta con preguntas', async () => {
    mockPrisma.survey.create.mockResolvedValue({
      id: 's-new',
      title: 'Nueva',
      businessId: '550e8400-e29b-41d4-a716-446655440000',
      questions: [{ id: 'q1', text: 'Como?', type: 'TEXT', order: 1 }],
    });

    const req = new NextRequest('http://localhost/api/surveys', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Nueva',
        questions: [{ text: 'Como?', type: 'TEXT', order: 1 }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.title).toBe('Nueva');
  });

  it('debe retornar 422 si falta título', async () => {
    const req = new NextRequest('http://localhost/api/surveys', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        title: '',
        questions: [{ text: 'Como?', type: 'TEXT', order: 1 }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
  });
});
