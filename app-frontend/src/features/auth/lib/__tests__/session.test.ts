import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveSession,
  getAccessToken,
  getRefreshToken,
  getSavedSession,
  clearSession,
} from '../session'
import type { SessionResponse } from '@/types/api/session'

function makeSession(overrides: Partial<SessionResponse> = {}): SessionResponse {
  return {
    authenticated: true,
    isOnboarded: true,
    supabaseUserId: 'su1',
    appUserId: 'au1',
    email: 'test@test.com',
    fullName: 'Test User',
    memberships: [],
    ...overrides,
  }
}

describe('session lib', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveSession', () => {
    it('guarda access token y refresh token', () => {
      saveSession('at1', 'rt1')

      expect(localStorage.getItem('uplus_access_token')).toBe('at1')
      expect(localStorage.getItem('uplus_refresh_token')).toBe('rt1')
    })

    it('guarda la session si se provee', () => {
      const session = makeSession()
      saveSession('at1', 'rt1', session)

      const raw = localStorage.getItem('uplus_session')
      expect(raw).not.toBeNull()
      expect(JSON.parse(raw!).email).toBe('test@test.com')
    })

    it('no guarda session si es null', () => {
      saveSession('at1', 'rt1', null)
      expect(localStorage.getItem('uplus_session')).toBeNull()
    })
  })

  describe('getAccessToken', () => {
    it('retorna null si no hay token', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('retorna el token guardado', () => {
      localStorage.setItem('uplus_access_token', 'at1')
      expect(getAccessToken()).toBe('at1')
    })
  })

  describe('getRefreshToken', () => {
    it('retorna null si no hay token', () => {
      expect(getRefreshToken()).toBeNull()
    })

    it('retorna el token guardado', () => {
      localStorage.setItem('uplus_refresh_token', 'rt1')
      expect(getRefreshToken()).toBe('rt1')
    })
  })

  describe('getSavedSession', () => {
    it('retorna null si no hay session', () => {
      expect(getSavedSession()).toBeNull()
    })

    it('retorna la session parseada', () => {
      const session = makeSession()
      localStorage.setItem('uplus_session', JSON.stringify(session))
      expect(getSavedSession()?.email).toBe('test@test.com')
    })

    it('retorna null y limpia si hay JSON inválido', () => {
      localStorage.setItem('uplus_session', 'not-json')
      expect(getSavedSession()).toBeNull()
      expect(localStorage.getItem('uplus_session')).toBeNull()
    })
  })

  describe('clearSession', () => {
    it('elimina tokens y session', () => {
      saveSession('at1', 'rt1', makeSession())
      clearSession()

      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
      expect(getSavedSession()).toBeNull()
    })

    it('elimina también entradas de caché con prefijo uplus_cache_', () => {
      localStorage.setItem('uplus_cache_dashboard_b1', '{}')
      localStorage.setItem('uplus_cache_reviews_b1', '[]')
      localStorage.setItem('otro_prefijo', 'val')

      clearSession()

      expect(localStorage.getItem('uplus_cache_dashboard_b1')).toBeNull()
      expect(localStorage.getItem('uplus_cache_reviews_b1')).toBeNull()
      expect(localStorage.getItem('otro_prefijo')).toBe('val')
    })
  })
})
