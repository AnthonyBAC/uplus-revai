import { describe, it, expect, beforeEach } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useDashboard } from '../useDashboard'
import { useReviews } from '../useReviews'
import { useInsights } from '../useInsights'
import { useActions } from '../useActions'
import { useLocal } from '../useLocal'
import { useTooltip } from '../useTooltip'
import type { UseDashboardResult } from '../useDashboard'
import type { UseReviewsResult } from '../useReviews'
import type { UseInsightsResult } from '../useInsights'
import type { MembershipInfo } from '@/types/api/session'

const M = (o: Partial<MembershipInfo> = {}): MembershipInfo =>
  ({ membershipId: 'm1', businessId: 'b1', businessName: 'Biz', businessSlug: 'biz', role: 'ADMIN', isOwner: true, hasFullBranchAccess: true, branchIds: [], ...o })

function stub(path: string, fn: () => object) {
  server.use(http.get(path, () => HttpResponse.json(fn())))
}

// --- wrappers ---
function DH({ r, bid }: { r: { current: UseDashboardResult | null }; bid: string | null }) { r.current = useDashboard(bid); return null }
function RH({ r, bid }: { r: { current: UseReviewsResult | null }; bid: string | null }) { r.current = useReviews(bid); return null }
function IH({ r, bid }: { r: { current: UseInsightsResult | null }; bid: string | null }) { r.current = useInsights(bid); return null }
function AH({ r, bid }: { r: { current: ReturnType<typeof useActions> | null }; bid: string | null }) { r.current = useActions(bid); return null }
function LH({ r, m }: { r: { current: ReturnType<typeof useLocal> | null }; m: MembershipInfo | null }) { r.current = useLocal(m); return null }
function TH({ r }: { r: { current: ReturnType<typeof useTooltip> | null } }) { r.current = useTooltip(); return null }

describe('useDashboard', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga y cachea', async () => {
    stub('/api/analysis/dashboard', () => ({ businessId: 'b1', reviews: 10, surveys: 3, reports: 5, data: { reviews: [], surveys: [], reports: [] } }))
    const r = { current: null as UseDashboardResult | null }; render(<DH r={r} bid="b1" />)
    await waitFor(() => { expect(r.current!.loading).toBe(false) })
    expect(r.current!.data?.reviews).toBe(10)
    expect(localStorage.getItem('uplus_cache_dashboard_b1')).toBeTruthy()
  })
})

describe('useReviews', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga reviews', async () => {
    server.use(http.get('/api/analysis/reviews', () => HttpResponse.json([{ id: 'r1', businessId: 'b1', rating: 5, source: 'G', externalId: 'e1', content: 'OK', publishedAt: '2025-01-01T00:00:00Z' }])))
    const r = { current: null as UseReviewsResult | null }; render(<RH r={r} bid="b1" />)
    await waitFor(() => { expect(r.current!.loading).toBe(false) })
    expect(r.current!.data).toHaveLength(1)
  })
})

describe('useInsights', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga insights', async () => {
    server.use(http.get('/api/analysis/insights', () => HttpResponse.json({ businessId: 'b1', ratingTrend: [4.1], volumeTrend: [10], themes: [] })))
    const r = { current: null as UseInsightsResult | null }; render(<IH r={r} bid="b1" />)
    await waitFor(() => { expect(r.current!.loading).toBe(false) })
    expect(r.current!.data?.ratingTrend).toHaveLength(1)
  })
})

describe('useActions', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga, actualiza y expone totalReviews', async () => {
    server.use(http.get('/api/analysis/improvements', () => HttpResponse.json({ businessId: 'b1', totalReviews: 42, actions: [{ id: 'a1', title: 'T1', why: 'w', impact: 'alto', steps: 1, eta: '1s', status: 'sugerida', progress: 0, tag: 'T', detail: [] }] })))
    const r = { current: null as ReturnType<typeof useActions> | null }; render(<AH r={r} bid="b1" />)
    await waitFor(() => { expect(r.current!.loading).toBe(false) })
    expect(r.current!.totalReviews).toBe(42)
    act(() => r.current!.update('a1', { status: 'completada' }))
    expect(r.current!.actions[0].status).toBe('completada')
  })
})

describe('useLocal', () => {
  it('inicializa datos y toggle', () => {
    const r = { current: null as ReturnType<typeof useLocal> | null }; render(<LH r={r} m={M()} />)
    expect(r.current!.data.name).toBe('Biz')
    act(() => r.current!.toggleIntegration('g'))
    expect(r.current!.data.integrations[0].connected).toBe(true)
  })
  it('updateField', () => {
    const r = { current: null as ReturnType<typeof useLocal> | null }; render(<LH r={r} m={M()} />)
    act(() => r.current!.updateField('hours', '9-18'))
    expect(r.current!.data.hours).toBe('9-18')
  })
})

describe('useTooltip', () => {
  it('setTip muestra/oculta', () => {
    const r = { current: null as ReturnType<typeof useTooltip> | null }; render(<TH r={r} />)
    expect(r.current!.Tip()).toBeNull()
    act(() => r.current!.setTip({ x: 10, y: 20, text: 'Info' }))
    expect(r.current!.Tip()?.props.children).toBe('Info')
  })
})
