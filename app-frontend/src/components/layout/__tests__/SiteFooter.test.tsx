import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SiteFooter from '../SiteFooter'

describe('SiteFooter', () => {
  it('renderiza copyright y links', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/2026 U\+ Revai/)).toBeInTheDocument()
    expect(screen.getByText('Privacidad')).toBeInTheDocument()
    expect(screen.getByText('Términos')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
  })

  it('links tienen href correctos', () => {
    render(<SiteFooter />)
    expect(screen.getByText('Privacidad').closest('a')).toHaveAttribute('href', '/privacidad')
    expect(screen.getByText('Términos').closest('a')).toHaveAttribute('href', '/terminos')
    expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto')
  })
})
