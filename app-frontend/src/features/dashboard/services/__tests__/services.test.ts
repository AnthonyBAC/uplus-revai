import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { fetchDashboard } from '../dashboard'
import { fetchReviews } from '../reviews'
import { fetchInsights } from '../insights'
import { fetchImprovements } from '../improvements'

describe('dashboard services', () => {
  beforeEach(() => { server.resetHandlers() })

  it('fetchDashboard llama a /api/analysis/dashboard', async () => {
    server.use(http.get('/api/analysis/dashboard', ({ request }) => {
      if (new URL(request.url).searchParams.get('businessId') === 'b1')
        return HttpResponse.json({ businessId: 'b1', reviews: 5, surveys: 2, reports: 1, data: { reviews: [], surveys: [], reports: [] } })
      return new HttpResponse(null, { status: 400 })
    }))
    const r = await fetchDashboard('b1')
    expect(r.reviews).toBe(5)
    expect(r.surveys).toBe(2)
  })

  it('fetchReviews retorna array', async () => {
    server.use(http.get('/api/analysis/reviews', () => HttpResponse.json([{ id: 'r1', businessId: 'b1', rating: 4, source: 'G', externalId: 'e1', content: 'Ok', publishedAt: '2025-01-01T00:00:00Z' }])))
    const r = await fetchReviews('b1')
    expect(r).toHaveLength(1)
    expect(r[0].rating).toBe(4)
  })

  it('fetchInsights retorna temas', async () => {
    server.use(http.get('/api/analysis/insights', () => HttpResponse.json({ businessId: 'b1', ratingTrend: [4.1], volumeTrend: [10], themes: [{ name: 'Atención', sentiment: 'positivo', mentions: 5, trend: 2 }] })))
    const r = await fetchInsights('b1')
    expect(r.themes).toHaveLength(1)
    expect(r.themes[0].name).toBe('Atención')
  })

  it('fetchImprovements retorna acciones', async () => {
    server.use(http.get('/api/analysis/improvements', () => HttpResponse.json({ businessId: 'b1', totalReviews: 20, actions: [{ id: 'a1', title: 'T1', why: 'w', impact: 'alto', steps: 2, eta: '1s', status: 'sugerida', progress: 0, tag: 'T', detail: [] }] })))
    const r = await fetchImprovements('b1')
    expect(r.totalReviews).toBe(20)
    expect(r.actions).toHaveLength(1)
  })
})
