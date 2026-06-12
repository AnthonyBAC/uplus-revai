import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
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

  it('muestra error si signup falla', async () => {
    server.use(
      http.post('/api/auth/signup', () =>
        HttpResponse.json({ error: 'Email ya registrado' }, { status: 409 }),
      ),
    )

    render(<RegisterForm />)
    await userEvent.type(screen.getByLabelText('Tu nombre'), 'Test')
    await userEvent.type(screen.getByLabelText('Correo'), 'dup@b.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), '12345678')
    await userEvent.click(screen.getByRole('button', { name: /Crear cuenta gratis/ }))

    await waitFor(() => {
      expect(screen.getByText('Email ya registrado')).toBeInTheDocument()
    })
  })

  it('renderiza los 3 pasos del right panel', () => {
    render(<RegisterForm />)
    expect(screen.getByText('Conectas Google Reviews')).toBeInTheDocument()
    expect(screen.getByText('La IA agrupa por temas')).toBeInTheDocument()
    expect(screen.getByText('Recibes tu plan cada lunes')).toBeInTheDocument()
  })
})
