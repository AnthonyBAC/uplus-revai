import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResetPasswordForm from '../../reset-password/ResetPasswordForm'

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza campo de nueva contraseña', () => {
    window.location.hash = '#access_token=abc&refresh_token=def&type=recovery'
    render(<ResetPasswordForm />)
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
  })

  it('muestra error si el enlace es inválido', () => {
    window.location.hash = '#'
    render(<ResetPasswordForm />)
    expect(screen.getByText(/El enlace de recuperación es inválido/)).toBeInTheDocument()
  })

  it('botón deshabilitado si enlace inválido', () => {
    window.location.hash = '#'
    render(<ResetPasswordForm />)
    expect(screen.getByRole('button', { name: /Guardar nueva/ })).toBeDisabled()
  })

  it('renderiza título', () => {
    window.location.hash = '#access_token=abc&refresh_token=def&type=recovery'
    render(<ResetPasswordForm />)
    expect(screen.getByText(/Crea una nueva/)).toBeInTheDocument()
  })
})
