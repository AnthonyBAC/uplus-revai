import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResetPasswordPanel from '../panels/ResetPasswordPanel'

describe('ResetPasswordPanel', () => {
  it('renderiza tips de contraseña', () => {
    render(<ResetPasswordPanel />)
    expect(screen.getByText(/CREA UNA CONTRASEÑA SEGURA/)).toBeInTheDocument()
    expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument()
    expect(screen.getByText('No reutilices contraseñas')).toBeInTheDocument()
  })
})
