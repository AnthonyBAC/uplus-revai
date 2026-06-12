import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsForm from '../../settings/SettingsForm'
import { saveSession } from '@/features/auth/lib/session'

describe('SettingsForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza tabs name, email, password', () => {
    render(<SettingsForm />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Contraseña')).toBeInTheDocument()
  })

  it('tab name activo por defecto muestra campo', () => {
    saveSession('at1', 'rt1')
    render(<SettingsForm />)
    expect(screen.getByLabelText('Nuevo nombre')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Guardar cambios/ })).toBeInTheDocument()
  })

  it('cambiar a tab password muestra campos de contraseña', async () => {
    saveSession('at1', 'rt1')
    render(<SettingsForm />)
    await userEvent.click(screen.getByText('Contraseña'))
    expect(screen.getByLabelText('Contraseña actual')).toBeInTheDocument()
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
  })

  it('renderiza tips panel', () => {
    render(<SettingsForm />)
    expect(screen.getByText(/Mantén tu perfil/)).toBeInTheDocument()
  })
})
