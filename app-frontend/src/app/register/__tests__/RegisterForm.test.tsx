import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@/mocks/server'
import RegisterForm from '../../register/RegisterForm'

describe('RegisterForm', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it('renderiza campos nombre, email y password', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Tu nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('botón dice "Crear cuenta gratis →"', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('button', { name: /Crear cuenta gratis/ })).toBeInTheDocument()
  })

  it('renderiza los 3 pasos del right panel', () => {
    render(<RegisterForm />)
    expect(screen.getByText('Conectas Google Reviews')).toBeInTheDocument()
    expect(screen.getByText('La IA agrupa por temas')).toBeInTheDocument()
    expect(screen.getByText('Recibes tu plan cada lunes')).toBeInTheDocument()
  })
})
