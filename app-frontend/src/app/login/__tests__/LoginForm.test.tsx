import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('renderiza título', () => {
    render(<LoginForm />)
    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument()
  })

  it('renderiza links de navegación', () => {
    render(<LoginForm />)
    expect(screen.getByText('¿La olvidaste?')).toBeInTheDocument()
    const links = screen.getAllByText('Crear cuenta →')
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('toggle contraseña', async () => {
    render(<LoginForm />)
    await userEvent.click(screen.getByText('VER'))
    expect(screen.getByText('OCULTAR')).toBeInTheDocument()
  })

  it('botón submit presente', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /Entrar al panel/ })).toBeInTheDocument()
  })
})
