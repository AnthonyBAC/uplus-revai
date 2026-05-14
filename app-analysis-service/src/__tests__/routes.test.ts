import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

import { POST } from '@/app/api/analysis/run/route';
import { GET as getResults } from '@/app/api/analysis/results/route';
import { GET as getDashboard } from '@/app/api/analysis/dashboard/route';

describe('POST /api/analysis/run', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe orquestar análisis y retornar resultado de IA', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, businessId: '550e8400-e29b-41d4-a716-446655440000', itemsAnalyzed: 10 }),
    });

    const req = new NextRequest('http://localhost/api/analysis/run', {
      method: 'POST',
      body: JSON.stringify({ businessId: '550e8400-e29b-41d4-a716-446655440000' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.itemsAnalyzed).toBe(10);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/analysis/generate'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('debe retornar 400 si falta businessId', async () => {
    const req = new NextRequest('http://localhost/api/analysis/run', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('debe retornar error si IA falla', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Internal error'),
      status: 500,
    });

    const req = new NextRequest('http://localhost/api/analysis/run', {
      method: 'POST',
      body: JSON.stringify({ businessId: '550e8400-e29b-41d4-a716-446655440000' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe('GET /api/analysis/results', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe consultar resultados desde report-service', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 'a1', summary: 'Resumen' }]),
    });

    const req = new NextRequest('http://localhost/api/analysis/results?businessId=550e8400-e29b-41d4-a716-446655440000');
    const res = await getResults(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(1);
  });
});

describe('GET /api/analysis/dashboard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe agregar datos de reviews, surveys y reports', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 'r1' }]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 's1' }]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 'rep1' }]) });

    const req = new NextRequest('http://localhost/api/analysis/dashboard?businessId=550e8400-e29b-41d4-a716-446655440000');
    const res = await getDashboard(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.reviews).toBe(1);
    expect(body.surveys).toBe(1);
    expect(body.reports).toBe(1);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('debe retornar 400 si falta businessId', async () => {
    const res = await getDashboard(new NextRequest('http://localhost/api/analysis/dashboard'));
    expect(res.status).toBe(400);
  });
});
