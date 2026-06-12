import { describe, it, expect, beforeEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import apiFetch from '../client'
import { saveSession, getAccessToken, getRefreshToken, clearSession } from '@/features/auth/lib/session'

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
    server.resetHandlers()
  })

  it('hace GET a /api/{path} y parsea JSON', async () => {
    server.use(
      http.get('/api/test/200', () =>
        HttpResponse.json({ ok: true }),
      ),
    )

    const data = await apiFetch<{ ok: boolean }>('/test/200')
    expect(data).toEqual({ ok: true })
  })

  it('agrega header Authorization con Bearer token', async () => {
    saveSession('at-secret', 'rt-secret')
    let authHeader: string | null = null

    server.use(
      http.get('/api/test/auth', ({ request }) => {
        authHeader = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiFetch('/test/auth')
    expect(authHeader).toBe('Bearer at-secret')
  })

  it('lanza error con mensaje del backend si !ok', async () => {
    server.use(
      http.get('/api/test/500', () =>
        HttpResponse.json({ error: 'Algo falló' }, { status: 500 }),
      ),
    )

    await expect(apiFetch('/test/500')).rejects.toThrow('Algo falló')
  })

  it('lanza error genérico si backend no tiene campo error', async () => {
    server.use(
      http.get('/api/test/plain-500', () =>
        HttpResponse.text('plain error', { status: 500 }),
      ),
    )

    await expect(apiFetch('/test/plain-500')).rejects.toThrow('Error desconocido')
  })

  it('deduplica GET requests simultáneos', async () => {
    let callCount = 0
    server.use(
      http.get('/api/test/dedup', () => {
        callCount += 1
        return HttpResponse.json({ calls: callCount })
      }),
    )

    const [a, b] = await Promise.all([
      apiFetch<{ calls: number }>('/test/dedup'),
      apiFetch<{ calls: number }>('/test/dedup'),
    ])

    expect(callCount).toBe(1)
    expect(a.calls).toBe(1)
    expect(b.calls).toBe(1)
  })

  it('no deduplica POST requests', async () => {
    let callCount = 0
    server.use(
      http.post('/api/test/post', () => {
        callCount += 1
        return HttpResponse.json({ calls: callCount })
      }),
    )

    const [a, b] = await Promise.all([
      apiFetch<{ calls: number }>('/test/post', { method: 'POST' }),
      apiFetch<{ calls: number }>('/test/post', { method: 'POST' }),
    ])

    expect(callCount).toBe(2)
  })
})

describe('apiFetch — refresh 401', () => {
  beforeEach(() => {
    localStorage.clear()
    server.resetHandlers()
    vi.stubGlobal('window', { ...window, location: { href: '/login' } })
  })

  it('refresca token y reintenta si recibe 401', async () => {
    saveSession('expired-at', 'refresh-rt')

    let refreshCalled = false
    let finalAuthHeader: string | null = null

    server.use(
      http.get('/api/test/401-refresh', ({ request }) => {
        const auth = request.headers.get('Authorization')
        if (auth === 'Bearer expired-at') {
          return new HttpResponse(null, { status: 401 })
        }
        finalAuthHeader = auth
        return HttpResponse.json({ ok: true })
      }),
      http.post('/api/auth/refresh', () => {
        refreshCalled = true
        return HttpResponse.json({
          user: { email: 'x@x.com' },
          session: { accessToken: 'new-at', refreshToken: 'new-rt' },
        })
      }),
    )

    const data = await apiFetch<{ ok: boolean }>('/test/401-refresh')

    expect(refreshCalled).toBe(true)
    expect(finalAuthHeader).toBe('Bearer new-at')
    expect(data).toEqual({ ok: true })
    expect(getAccessToken()).toBe('new-at')
  })

  it('limpia session y redirige a /login si refresh falla', async () => {
    saveSession('bad-at', 'bad-rt')

    server.use(
      http.get('/api/test/401-fail', () => new HttpResponse(null, { status: 401 })),
      http.post('/api/auth/refresh', () => new HttpResponse(null, { status: 401 })),
    )

    await expect(apiFetch('/test/401-fail')).rejects.toThrow('Sesión expirada')
    expect(getAccessToken()).toBeNull()
  })
})
