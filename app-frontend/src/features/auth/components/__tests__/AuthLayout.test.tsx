import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthLayout from '../layout/AuthLayout'

describe('AuthLayout', () => {
  it('renderiza children, logo y footer', () => {
    render(
      <AuthLayout topLinkText="¿No tienes cuenta?" topLinkCta="Crear cuenta →" topLinkHref="/register" rightPanel={<p>Panel derecho</p>}>
        <p>Contenido del form</p>
      </AuthLayout>,
    )
    expect(screen.getByText('Contenido del form')).toBeInTheDocument()
    expect(screen.getByText('Panel derecho')).toBeInTheDocument()
    expect(screen.getByAltText('U+ Revai')).toBeInTheDocument()
    expect(screen.getByText(/2026 U\+ Revai/)).toBeInTheDocument()
  })

  it('renderiza link superior con CTA', () => {
    render(
      <AuthLayout topLinkText="¿No tienes cuenta?" topLinkCta="Crear cuenta →" topLinkHref="/register" rightPanel={<p>x</p>}>
        <p>x</p>
      </AuthLayout>,
    )
    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument()
    expect(screen.getByText('Crear cuenta →')).toBeInTheDocument()
  })
})
