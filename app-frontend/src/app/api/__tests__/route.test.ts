import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../[...service]/route'

describe('BFF proxy', () => {
  const origAuth = process.env.AUTH_SERVICE_URL
  const origAnalysis = process.env.ANALYSIS_SERVICE_URL

  beforeEach(() => {
    vi.stubEnv('AUTH_SERVICE_URL', 'http://auth:3001')
    vi.stubEnv('ANALYSIS_SERVICE_URL', 'http://analysis:3002')
  })

  afterEach(() => {
    vi.stubEnv('AUTH_SERVICE_URL', origAuth ?? '')
    vi.stubEnv('ANALYSIS_SERVICE_URL', origAnalysis ?? '')
  })

  it('retorna 200 con respuesta del backend', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }),
    )
    vi.stubGlobal('fetch', mockFetch)

    const req = new NextRequest('http://localhost:3000/api/auth/session')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ ok: true })
  })

  it('retorna 404 si no hay ruta configurada', async () => {
    const req = new NextRequest('http://localhost:3000/api/unknown/path')
    const res = await GET(req)
    expect(res.status).toBe(404)
  })

  it('retorna 502 si fetch falla', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'))
    vi.stubGlobal('fetch', mockFetch)

    const req = new NextRequest('http://localhost:3000/api/auth/session')
    const res = await GET(req)
    expect(res.status).toBe(502)
  })
})
