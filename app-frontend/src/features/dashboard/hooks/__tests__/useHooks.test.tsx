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

function DH({ rRef, bid }: { rRef: React.MutableRefObject<UseDashboardResult | null>; bid: string | null }) {
  // eslint-disable-next-line react-hooks/refs
  rRef.current = useDashboard(bid); return null
}
function RH({ rRef, bid }: { rRef: React.MutableRefObject<UseReviewsResult | null>; bid: string | null }) {
  // eslint-disable-next-line react-hooks/refs
  rRef.current = useReviews(bid); return null
}
function IH({ rRef, bid }: { rRef: React.MutableRefObject<UseInsightsResult | null>; bid: string | null }) {
  // eslint-disable-next-line react-hooks/refs
  rRef.current = useInsights(bid); return null
}
function AH({ rRef, bid }: { rRef: React.MutableRefObject<ReturnType<typeof useActions> | null>; bid: string | null }) {
  // eslint-disable-next-line react-hooks/refs
  rRef.current = useActions(bid); return null
}
function LH({ rRef, m }: { rRef: React.MutableRefObject<ReturnType<typeof useLocal> | null>; m: MembershipInfo | null }) {
  // eslint-disable-next-line react-hooks/refs
  rRef.current = useLocal(m); return null
}
function TH({ rRef }: { rRef: React.MutableRefObject<ReturnType<typeof useTooltip> | null> }) {
  // eslint-disable-next-line react-hooks/refs
  rRef.current = useTooltip(); return null
}

describe('useDashboard', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga y cachea', async () => {
    server.use(http.get('/api/analysis/dashboard', () => HttpResponse.json({ businessId: 'b1', reviews: 10, surveys: 3, reports: 5, data: { reviews: [], surveys: [], reports: [] } })))
    const rRef = { current: null as UseDashboardResult | null }; render(<DH rRef={rRef} bid="b1" />)
    await waitFor(() => { expect(rRef.current!.loading).toBe(false) })
    expect(rRef.current!.data?.reviews).toBe(10)
    expect(localStorage.getItem('uplus_cache_dashboard_b1')).toBeTruthy()
  })
})

describe('useReviews', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga reviews', async () => {
    server.use(http.get('/api/analysis/reviews', () => HttpResponse.json([{ id: 'r1', businessId: 'b1', rating: 5, source: 'G', externalId: 'e1', content: 'OK', publishedAt: '2025-01-01T00:00:00Z' }])))
    const rRef = { current: null as UseReviewsResult | null }; render(<RH rRef={rRef} bid="b1" />)
    await waitFor(() => { expect(rRef.current!.loading).toBe(false) })
    expect(rRef.current!.data).toHaveLength(1)
  })
})

describe('useInsights', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga insights', async () => {
    server.use(http.get('/api/analysis/insights', () => HttpResponse.json({ businessId: 'b1', ratingTrend: [4.1], volumeTrend: [10], themes: [] })))
    const rRef = { current: null as UseInsightsResult | null }; render(<IH rRef={rRef} bid="b1" />)
    await waitFor(() => { expect(rRef.current!.loading).toBe(false) })
    expect(rRef.current!.data?.ratingTrend).toHaveLength(1)
  })
})

describe('useActions', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })
  it('carga, actualiza y expone totalReviews', async () => {
    server.use(http.get('/api/analysis/improvements', () => HttpResponse.json({ businessId: 'b1', totalReviews: 42, actions: [{ id: 'a1', title: 'T1', why: 'w', impact: 'alto', steps: 1, eta: '1s', status: 'sugerida', progress: 0, tag: 'T', detail: [] }] })))
    const rRef = { current: null as ReturnType<typeof useActions> | null }; render(<AH rRef={rRef} bid="b1" />)
    await waitFor(() => { expect(rRef.current!.loading).toBe(false) })
    expect(rRef.current!.totalReviews).toBe(42)
    act(() => rRef.current!.update('a1', { status: 'completada' }))
    expect(rRef.current!.actions[0].status).toBe('completada')
  })
})

describe('useLocal', () => {
  it('inicializa datos y toggle', () => {
    const rRef = { current: null as ReturnType<typeof useLocal> | null }; render(<LH rRef={rRef} m={M()} />)
    expect(rRef.current!.data.name).toBe('Biz')
    act(() => rRef.current!.toggleIntegration('g'))
    expect(rRef.current!.data.integrations[0].connected).toBe(true)
  })
  it('updateField', () => {
    const rRef = { current: null as ReturnType<typeof useLocal> | null }; render(<LH rRef={rRef} m={M()} />)
    act(() => rRef.current!.updateField('hours', '9-18'))
    expect(rRef.current!.data.hours).toBe('9-18')
  })
})

describe('useTooltip', () => {
  it('setTip muestra/oculta', () => {
    const rRef = { current: null as ReturnType<typeof useTooltip> | null }; render(<TH rRef={rRef} />)
    expect(rRef.current!.Tip()).toBeNull()
    act(() => rRef.current!.setTip({ x: 10, y: 20, text: 'Info' }))
    expect(rRef.current!.Tip()?.props.children).toBe('Info')
  })
})
