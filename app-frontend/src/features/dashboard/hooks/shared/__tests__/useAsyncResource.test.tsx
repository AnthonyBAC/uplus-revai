import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import { useAsyncResource } from '../useAsyncResource'
import type { UseAsyncResourceResult } from '../useAsyncResource'

function HookTest<T>({ reporterRef, options }: {
  reporterRef: React.MutableRefObject<UseAsyncResourceResult<T> | null>
  options: Parameters<typeof useAsyncResource<T>>[0]
}) {
  // eslint-disable-next-line react-hooks/refs
  reporterRef.current = useAsyncResource<T>(options)
  return null
}

describe('useAsyncResource', () => {
  beforeEach(() => { localStorage.clear() })

  it('estado inicial: loading=true', () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true })
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: true, deps: [], fetcher }} />)
    expect(r.current!.loading).toBe(true)
    expect(r.current!.data).toBeNull()
  })

  it('carga datos exitosamente', async () => {
    const fetcher = vi.fn().mockResolvedValue({ hello: 'world' })
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: true, deps: [], fetcher }} />)
    await waitFor(() => { expect(r.current!.loading).toBe(false) })
    expect(r.current!.data).toEqual({ hello: 'world' })
  })

  it('maneja error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('falló'))
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: true, deps: [], fetcher }} />)
    await waitFor(() => { expect(r.current!.error).not.toBeNull() })
    expect(r.current!.error).toBe('falló')
  })

  it('no ejecuta fetcher si enabled=false', () => {
    const fetcher = vi.fn().mockResolvedValue({})
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: false, deps: [], fetcher }} />)
    expect(r.current!.loading).toBe(false)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('refetch dispara nueva carga', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce({ v: 1 }).mockResolvedValueOnce({ v: 2 })
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: true, deps: [], fetcher }} />)
    await waitFor(() => { expect(r.current!.data).toEqual({ v: 1 }) })
    act(() => r.current!.refetch())
    await waitFor(() => { expect(r.current!.data).toEqual({ v: 2 }) })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('cachea en localStorage', async () => {
    const cacheKey = 'uplus_cache_test_key'
    const fetcher = vi.fn().mockResolvedValue({ cached: true })
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: true, deps: [], fetcher, cacheKey }} />)
    await waitFor(() => { expect(r.current!.data).toEqual({ cached: true }) })
    expect(localStorage.getItem(cacheKey)).not.toBeNull()
  })

  it('restaura desde caché sin llamar fetcher', async () => {
    const cacheKey = 'uplus_cache_restore_test'
    localStorage.setItem(cacheKey, JSON.stringify({ restored: true }))
    const fetcher = vi.fn().mockResolvedValue({})
    const r = { current: null as UseAsyncResourceResult<unknown> | null }
    render(<HookTest reporterRef={r} options={{ enabled: true, deps: [], fetcher, cacheKey }} />)
    await waitFor(() => { expect(r.current!.data).toEqual({ restored: true }) })
    expect(fetcher).not.toHaveBeenCalled()
  })
})
