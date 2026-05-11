import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@root/lib/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockPrisma = vi.hoisted(() => ({
  analysisResult: { findMany: vi.fn(), create: vi.fn() },
  report: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
}));

vi.mock('@root/lib/prisma', () => ({ prisma: mockPrisma }));

import { GET as getAnalysis, POST as postAnalysis } from '@/app/api/analysis/route';
import { GET as getReports, POST as postReports } from '@/app/api/reports/route';
import { GET as getReportById } from '@/app/api/reports/[id]/route';

describe('GET /api/analysis', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar resultados de análisis', async () => {
    mockPrisma.analysisResult.findMany.mockResolvedValue([{ id: 'a1', summary: 'Resumen' }]);
    const res = await getAnalysis(new NextRequest('http://localhost/api/analysis?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it('debe retornar 400 si falta businessId', async () => {
    const res = await getAnalysis(new NextRequest('http://localhost/api/analysis'));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/analysis', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe crear analysis result', async () => {
    mockPrisma.analysisResult.create.mockResolvedValue({ id: 'a-new' });
    const req = new NextRequest('http://localhost/api/analysis', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        sourceType: 'REVIEW',
        sourceId: '660e8400-e29b-41d4-a716-446655440000',
        sentiment: 'POSITIVE',
        summary: 'Buen análisis',
      }),
    });
    const res = await postAnalysis(req);
    expect(res.status).toBe(201);
  });
});

describe('GET /api/reports', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar reportes', async () => {
    mockPrisma.report.findMany.mockResolvedValue([{ id: 'r1', title: 'Reporte Q1' }]);
    const res = await getReports(new NextRequest('http://localhost/api/reports?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);
  });

  it('debe retornar 400 sin businessId', async () => {
    const res = await getReports(new NextRequest('http://localhost/api/reports'));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/reports', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe crear reporte', async () => {
    mockPrisma.report.create.mockResolvedValue({ id: 'r-new', title: 'Nuevo' });
    const req = new NextRequest('http://localhost/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        businessId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Reporte Mayo',
        periodStart: '2026-05-01T00:00:00Z',
        periodEnd: '2026-05-31T00:00:00Z',
      }),
    });
    const res = await postReports(req);
    expect(res.status).toBe(201);
  });
});

describe('GET /api/reports/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe retornar reporte por ID', async () => {
    mockPrisma.report.findUnique.mockResolvedValue({ id: 'r1', businessId: '550e8400-e29b-41d4-a716-446655440000', title: 'Reporte' });
    const res = await getReportById(new NextRequest('http://localhost/api/reports/r1'), {
      params: Promise.resolve({ id: '660e8400-e29b-41d4-a716-446655440000' }),
    });
    expect(res.status).toBe(200);
  });

  it('debe retornar 404 si no existe', async () => {
    mockPrisma.report.findUnique.mockResolvedValue(null);
    const res = await getReportById(new NextRequest('http://localhost/api/reports/r1'), {
      params: Promise.resolve({ id: '660e8400-e29b-41d4-a716-446655440000' }),
    });
    expect(res.status).toBe(404);
  });
});
