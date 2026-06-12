import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { BusinessProvider, useBusiness } from '../BusinessContext'
import type { MembershipInfo } from '@/types/api/session'

const m1: MembershipInfo = { membershipId: 'm1', businessId: 'b1', businessName: 'Biz1', businessSlug: 'biz1', role: 'ADMIN', isOwner: true, hasFullBranchAccess: true, branchIds: [] }
const m2: MembershipInfo = { membershipId: 'm2', businessId: 'b2', businessName: 'Biz2', businessSlug: 'biz2', role: 'TRABAJADOR', isOwner: false, hasFullBranchAccess: false, branchIds: ['br1'] }

function Consumer() {
  const { activeBusinessId, activeMembership, memberships, setActiveBusinessId } = useBusiness()
  return (
    <div>
      <span data-testid="bid">{activeBusinessId}</span>
      <span data-testid="bname">{activeMembership?.businessName}</span>
      <span data-testid="count">{memberships.length}</span>
      <button data-testid="switch" onClick={() => setActiveBusinessId('b2')}>Switch</button>
    </div>
  )
}

describe('BusinessContext', () => {
  beforeEach(() => { localStorage.clear() })

  it('inicializa con primer membership como activo', () => {
    render(<BusinessProvider memberships={[m1, m2]}><Consumer /></BusinessProvider>)
    expect(screen.getByTestId('bid').textContent).toBe('b1')
    expect(screen.getByTestId('bname').textContent).toBe('Biz1')
    expect(screen.getByTestId('count').textContent).toBe('2')
  })

  it('cambia de business activo y persiste en localStorage', () => {
    render(<BusinessProvider memberships={[m1, m2]}><Consumer /></BusinessProvider>)
    act(() => screen.getByTestId('switch').click())
    expect(screen.getByTestId('bid').textContent).toBe('b2')
    expect(screen.getByTestId('bname').textContent).toBe('Biz2')
    expect(localStorage.getItem('uplus_active_business_id')).toBe('b2')
  })

  it('sin memberships queda null', () => {
    render(<BusinessProvider memberships={[]}><Consumer /></BusinessProvider>)
    expect(screen.getByTestId('bid').textContent).toBe('')
  })
})
