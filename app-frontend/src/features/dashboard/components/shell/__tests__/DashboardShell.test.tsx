import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { BusinessProvider } from '../../BusinessContext'
import DashboardShell from '../DashboardShell'
import type { SessionResponse } from '@/types/api/session'

const session: SessionResponse = {
  authenticated: true,
  isOnboarded: true,
  supabaseUserId: 'su1',
  appUserId: 'au1',
  email: 'test@test.com',
  fullName: 'Test User',
  memberships: [{ membershipId: 'm1', businessId: 'b1', businessName: 'Mi Negocio', businessSlug: 'mi-negocio', role: 'ADMIN', isOwner: true, hasFullBranchAccess: true, branchIds: [] }],
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <BusinessProvider memberships={session.memberships}>{children}</BusinessProvider>
}

describe('DashboardShell', () => {
  beforeEach(() => {
    localStorage.clear()
    server.resetHandlers()
  })

  it('renderiza shell con children', () => {
    render(
      <Wrapper>
        <DashboardShell session={session}>
          <p>Contenido del dashboard</p>
        </DashboardShell>
      </Wrapper>,
    )

    expect(screen.getByText('Contenido del dashboard')).toBeInTheDocument()
  })

  it('renderiza Topbar y Sidebar', () => {
    render(
      <Wrapper>
        <DashboardShell session={session}>
          <p>test</p>
        </DashboardShell>
      </Wrapper>,
    )

    expect(screen.getByText('Resumen')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('muestra breadcrumb con nombre del negocio', () => {
    render(
      <Wrapper>
        <DashboardShell session={session}>
          <p>test</p>
        </DashboardShell>
      </Wrapper>,
    )

    const elements = screen.getAllByText('Mi Negocio')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })
})
