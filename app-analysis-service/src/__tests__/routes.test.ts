import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@uplus/auth', () => ({
  requireAuth: vi.fn(() => Promise.resolve({ appUserId: 'u1', supabaseUserId: 's1', email: 'a@t.com' })),
  requireBusinessAccess: vi.fn(() => Promise.resolve({ membershipId: 'm1', role: 'ADMIN' })),
  requireEndpointPermission: vi.fn(() => Promise.resolve()),
}));

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

import { GET as getDashboard } from '@/app/api/analysis/dashboard/route';
import { GET as getInsights } from '@/app/api/analysis/insights/route';
import { GET as getImprovements } from '@/app/api/analysis/improvements/route';

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

describe('GET /api/analysis/insights', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe agregar tendencias y temas desde reviews y analysis', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { rating: 5, publishedAt: '2026-05-01T00:00:00.000Z' },
          { rating: 3, publishedAt: '2026-05-02T00:00:00.000Z' },
        ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { keywords: ['servicio'], sentiment: 'NEGATIVE', createdAt: '2026-05-01T00:00:00.000Z' },
          { keywords: ['servicio', 'ambiente'], sentiment: 'POSITIVE', createdAt: '2026-05-02T00:00:00.000Z' },
        ]),
      });

    const res = await getInsights(new NextRequest('http://localhost/api/analysis/insights?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ratingTrend).toHaveLength(6);
    expect(body.volumeTrend).toHaveLength(6);
    expect(body.themes[0].name).toBe('servicio');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('GET /api/analysis/improvements', () => {
  beforeEach(() => vi.clearAllMocks());

  it('debe derivar acciones sugeridas desde análisis negativos', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ rating: 2 }, { rating: 4 }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { keywords: ['espera'], sentiment: 'NEGATIVE', createdAt: '2026-05-03T00:00:00.000Z' },
          { keywords: ['espera'], sentiment: 'NEGATIVE', createdAt: '2026-05-05T00:00:00.000Z' },
        ]),
      });

    const res = await getImprovements(new NextRequest('http://localhost/api/analysis/improvements?businessId=550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.totalReviews).toBe(2);
    expect(body.actions[0].tag).toBe('espera');
    expect(body.actions[0].status).toBe('sugerida');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
