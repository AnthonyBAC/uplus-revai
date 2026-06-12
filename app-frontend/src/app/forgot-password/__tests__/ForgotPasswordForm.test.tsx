import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ForgotPasswordForm from '../../forgot-password/ForgotPasswordForm'

describe('ForgotPasswordForm', () => {
  it('renderiza campo email y botón', () => {
    render(<ForgotPasswordForm />)
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enviar enlace/ })).toBeInTheDocument()
  })

  it('renderiza título', () => {
    render(<ForgotPasswordForm />)
    expect(screen.getByText(/Olvidaste tu/)).toBeInTheDocument()
  })
})
