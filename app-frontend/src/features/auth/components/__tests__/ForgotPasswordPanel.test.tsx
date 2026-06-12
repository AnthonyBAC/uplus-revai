import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ForgotPasswordPanel from '../panels/ForgotPasswordPanel'

describe('ForgotPasswordPanel', () => {
  it('renderiza contenido de seguridad', () => {
    render(<ForgotPasswordPanel />)
    expect(screen.getByText(/SEGURIDAD DE TU CUENTA/)).toBeInTheDocument()
    expect(screen.getByText('Enlace de un solo uso')).toBeInTheDocument()
    expect(screen.getByText('Revisa tu spam')).toBeInTheDocument()
  })
})
