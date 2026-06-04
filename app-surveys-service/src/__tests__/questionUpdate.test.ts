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
  surveyQuestion: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock('@uplus/db', () => ({ prisma: mockPrisma }));

import { PATCH, DELETE } from '@/app/api/surveys/[id]/questions/[questionId]/route';

describe('PATCH /api/surveys/:id/questions/:questionId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 404 si la pregunta no existe', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', {
      method: 'PATCH',
      body: JSON.stringify({ text: 'Texto actualizado' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Pregunta no encontrada' });
  });

  it('debe retornar 404 si la pregunta no pertenece a la encuesta', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue({
      id: 'q1',
      surveyId: 'other-survey',
      text: 'Pregunta',
      type: 'TEXT',
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', {
      method: 'PATCH',
      body: JSON.stringify({ text: 'Texto actualizado' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(404);
  });

  it('debe retornar 422 si el body no es valido', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue({
      id: 'q1',
      surveyId: 's1',
      text: 'Pregunta',
      type: 'TEXT',
      order: 1,
      survey: { businessId: 'biz-1' },
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', {
      method: 'PATCH',
      body: JSON.stringify({ type: 'INVALID_TYPE' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(422);
  });

  it('debe retornar 200 al actualizar la pregunta', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue({
      id: 'q1',
      surveyId: 's1',
      text: 'Pregunta original',
      type: 'TEXT',
      order: 1,
      survey: { businessId: 'biz-1' },
    });
    mockPrisma.surveyQuestion.update.mockResolvedValue({
      id: 'q1',
      surveyId: 's1',
      text: 'Pregunta actualizada',
      type: 'TEXT',
      order: 2,
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', {
      method: 'PATCH',
      body: JSON.stringify({ text: 'Pregunta actualizada', order: 2 }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.text).toBe('Pregunta actualizada');
  });
});

describe('DELETE /api/surveys/:id/questions/:questionId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar 404 si la pregunta no existe', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Pregunta no encontrada' });
  });

  it('debe retornar 404 si la pregunta no pertenece a la encuesta', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue({
      id: 'q1',
      surveyId: 'other-survey',
      text: 'Pregunta',
      type: 'TEXT',
    });

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(404);
  });

  it('debe retornar 204 al eliminar la pregunta', async () => {
    mockPrisma.surveyQuestion.findUnique.mockResolvedValue({
      id: 'q1',
      surveyId: 's1',
      text: 'Pregunta',
      type: 'TEXT',
      survey: { businessId: 'biz-1' },
    });
    mockPrisma.surveyQuestion.delete.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/surveys/s1/questions/q1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 's1', questionId: 'q1' }) });
    expect(res.status).toBe(204);
  });
});