import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { server } from '@/mocks/server'
import { SessionProvider, useSessionContext } from '../SessionProvider'
import { saveSession } from '@/features/auth/lib/session'

function Consumer() {
  const { status, session } = useSessionContext()
  return <div><span data-testid="status">{status}</span><span data-testid="email">{session?.email}</span></div>
}

describe('SessionProvider', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })

  it('authenticated con token + caché', async () => {
    saveSession('at1', 'rt1', { authenticated: true, isOnboarded: true, supabaseUserId: 'su1', appUserId: 'au1', email: 'x@x.com', fullName: 'X', memberships: [] })
    render(<SessionProvider><Consumer /></SessionProvider>)
    await waitFor(() => { expect(screen.getByTestId('status').textContent).toBe('authenticated') })
    expect(screen.getByTestId('email').textContent).toBe('x@x.com')
  })
})
