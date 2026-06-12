import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import {
  login,
  signup,
  logout,
  registerBusiness,
  refresh,
  forgotPassword,
  updateFullName,
  updateEmail,
  updatePassword,
  resetPassword,
} from '../auth-client'

describe('auth-client', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('login', () => {
    it('retorna tokens y perfil en login exitoso', async () => {
      server.use(
        http.post('/api/auth/login', () =>
          HttpResponse.json({
            user: { email: 'a@b.com', isOnboarded: true },
            session: { accessToken: 'at1', refreshToken: 'rt1', expiresAt: null },
          }),
        ),
      )

      const result = await login('a@b.com', 'pass')
      expect(result.accessToken).toBe('at1')
      expect(result.refreshToken).toBe('rt1')
      expect(result.profile.email).toBe('a@b.com')
    })

    it('lanza error si credenciales inválidas', async () => {
      server.use(
        http.post('/api/auth/login', () =>
          HttpResponse.json({ error: 'Credenciales inválidas' }, { status: 401 }),
        ),
      )

      await expect(login('a@b.com', 'bad')).rejects.toThrow('Credenciales inválidas')
    })
  })

  describe('signup', () => {
    it('no lanza error en registro exitoso', async () => {
      server.use(
        http.post('/api/auth/signup', () => HttpResponse.json({}, { status: 201 })),
      )

      await expect(signup('new@b.com', 'pass', 'New User')).resolves.toBeUndefined()
    })

    it('lanza error si email ya existe', async () => {
      server.use(
        http.post('/api/auth/signup', () =>
          HttpResponse.json({ error: 'Email ya registrado' }, { status: 409 }),
        ),
      )

      await expect(signup('dup@b.com', 'pass', 'Dup')).rejects.toThrow('Email ya registrado')
    })
  })

  describe('logout', () => {
    it('cierra sesión correctamente', async () => {
      server.use(
        http.post('/api/auth/logout', () => HttpResponse.json({})),
      )

      await expect(logout('at1')).resolves.toBeUndefined()
    })
  })

  describe('registerBusiness', () => {
    it('registra negocio y retorna ids', async () => {
      server.use(
        http.post('/api/auth/register', () =>
          HttpResponse.json({
            userId: 'u1',
            businessId: 'b1',
            businessSlug: 'my-biz',
            branchId: 'br1',
          }),
        ),
      )

      const result = await registerBusiness({
        fullName: 'Owner',
        businessName: 'My Biz',
        businessSlug: 'my-biz',
      }, 'at1')

      expect(result.businessId).toBe('b1')
      expect(result.businessSlug).toBe('my-biz')
    })
  })

  describe('refresh', () => {
    it('renueva tokens', async () => {
      server.use(
        http.post('/api/auth/refresh', () =>
          HttpResponse.json({
            user: { email: 'x@x.com' },
            session: { accessToken: 'new-at', refreshToken: 'new-rt' },
          }),
        ),
      )

      const result = await refresh('old-rt')
      expect(result.accessToken).toBe('new-at')
      expect(result.refreshToken).toBe('new-rt')
    })

    it('lanza error si refresh token es inválido', async () => {
      server.use(
        http.post('/api/auth/refresh', () =>
          HttpResponse.json({ error: 'Refresh token inválido' }, { status: 401 }),
        ),
      )

      await expect(refresh('bad-rt')).rejects.toThrow('Refresh token inválido')
    })
  })

  describe('forgotPassword', () => {
    it('envía solicitud de recuperación', async () => {
      server.use(
        http.post('/api/auth/forgot-password', () => HttpResponse.json({})),
      )

      await expect(forgotPassword('a@b.com')).resolves.toBeUndefined()
    })
  })

  describe('updateFullName', () => {
    it('actualiza nombre', async () => {
      server.use(
        http.patch('/api/auth/profile', () => HttpResponse.json({})),
      )

      await expect(updateFullName('at1', 'New Name')).resolves.toBeUndefined()
    })
  })

  describe('updateEmail', () => {
    it('actualiza email', async () => {
      server.use(
        http.patch('/api/auth/email', () => HttpResponse.json({})),
      )

      await expect(updateEmail('at1', 'new@b.com')).resolves.toBeUndefined()
    })
  })

  describe('updatePassword', () => {
    it('cambia contraseña', async () => {
      server.use(
        http.patch('/api/auth/password', () => HttpResponse.json({})),
      )

      await expect(updatePassword('at1', 'old', 'newPass')).resolves.toBeUndefined()
    })
  })

  describe('resetPassword', () => {
    it('restablece contraseña con token de recuperación', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => HttpResponse.json({})),
      )

      await expect(
        resetPassword('at-recovery', 'rt-recovery', 'newPass'),
      ).resolves.toBeUndefined()
    })
  })
})
