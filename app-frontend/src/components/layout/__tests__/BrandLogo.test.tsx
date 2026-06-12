import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BrandLogo from '../BrandLogo'

describe('BrandLogo', () => {
  it('renderiza imagen con alt correcto', () => {
    render(<BrandLogo />)
    expect(screen.getByAltText('U+ Revai')).toBeInTheDocument()
  })

  it('variant default usa Revai_v1', () => {
    render(<BrandLogo variant="default" />)
    const img = screen.getByAltText('U+ Revai')
    expect(img.getAttribute('src')).toMatch(/Revai_v1/)
  })

  it('variant pastel usa Revai_v2', () => {
    render(<BrandLogo variant="pastel" />)
    const img = screen.getByAltText('U+ Revai')
    expect(img.getAttribute('src')).toMatch(/Revai_v2/)
  })
})
