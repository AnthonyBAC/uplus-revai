import { describe, it, expect, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useSession } from '../useSession'
import { saveSession } from '@/features/auth/lib/session'
import type { UseSessionResult } from '../useSession'

function HookTest({ reporterRef }: { reporterRef: React.MutableRefObject<UseSessionResult | null> }) {
  // eslint-disable-next-line react-hooks/refs
  reporterRef.current = useSession()
  return null
}

describe('useSession', () => {
  beforeEach(() => { localStorage.clear(); server.resetHandlers() })

  it('inicia loading y pasa a unauthenticated sin token', async () => {
    const r = { current: null as UseSessionResult | null }
    render(<HookTest reporterRef={r} />)
    await waitFor(() => { expect(r.current!.status).toBe('unauthenticated') })
  })

  it('token + caché → authenticated sin API', async () => {
    saveSession('at1', 'rt1', {
      authenticated: true, isOnboarded: true,
      supabaseUserId: 'su1', appUserId: 'au1',
      email: 'cached@x.com', fullName: 'Cached', memberships: [],
    })
    const r = { current: null as UseSessionResult | null }
    render(<HookTest reporterRef={r} />)
    await waitFor(() => { expect(r.current!.status).toBe('authenticated') })
    expect(r.current!.session?.email).toBe('cached@x.com')
  })

  it('API falla → limpia sesión', async () => {
    saveSession('bad-at', 'bad-rt')
    server.use(http.get('/api/auth/session', () => new HttpResponse(null, { status: 401 })))
    const r = { current: null as UseSessionResult | null }
    render(<HookTest reporterRef={r} />)
    await waitFor(() => { expect(r.current!.status).toBe('unauthenticated') })
    expect(localStorage.getItem('uplus_access_token')).toBeNull()
  })
})
