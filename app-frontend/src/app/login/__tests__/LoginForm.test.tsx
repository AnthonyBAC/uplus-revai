import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import LoginForm from '../../login/LoginForm'

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear()
    server.resetHandlers()
  })

  it('renderiza campos email y password', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('renderiza título y bienvenida', () => {
    render(<LoginForm />)
    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument()
    expect(screen.getByText(/Entra a ver tus/)).toBeInTheDocument()
  })

  it('renderiza link a registro', () => {
    render(<LoginForm />)
    const links = screen.getAllByText('Crear cuenta →')
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('botón submit dice "Entrar al panel →"', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /Entrar al panel/ })).toBeInTheDocument()
  })

  it('toggle muestra/oculta contraseña', async () => {
    render(<LoginForm />)
    const toggle = screen.getByText('VER')
    await userEvent.click(toggle)
    expect(screen.getByText('OCULTAR')).toBeInTheDocument()
  })

  it('muestra error si login falla', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ error: 'Credenciales inválidas' }, { status: 401 }),
      ),
    )

    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('Correo'), 'bad@mail.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /Entrar al panel/ }))

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
    })
  })

  it('login exitoso redirige a dashboard', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({
          user: { authenticated: true, isOnboarded: true, supabaseUserId: 'su1', appUserId: 'au1', email: 'a@b.com', fullName: 'Test', memberships: [] },
          session: { accessToken: 'at1', refreshToken: 'rt1' },
        }),
      ),
    )

    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('Correo'), 'a@b.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'pass123')
    await userEvent.click(screen.getByRole('button', { name: /Entrar al panel/ }))

    await waitFor(() => {
      expect(localStorage.getItem('uplus_access_token')).toBe('at1')
    })
  })
})
