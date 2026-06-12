import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SiteHeader from '../SiteHeader'

describe('SiteHeader — marketing', () => {
  it('renderiza logo y links de navegación', () => {
    render(<SiteHeader mode="marketing" />)
    expect(screen.getByAltText('U+ Revai')).toBeInTheDocument()
    expect(screen.getByText('Producto')).toBeInTheDocument()
  })

  it('renderiza botones login y demo', () => {
    render(<SiteHeader mode="marketing" />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText(/Ir a demo/)).toBeInTheDocument()
  })

  it('modo simple muestra botón de volver', () => {
    render(<SiteHeader mode="simple" backHref="/login" backLabel="Volver al login" />)
    expect(screen.getByText('Volver al login')).toBeInTheDocument()
  })
})
