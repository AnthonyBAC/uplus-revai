import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroSection from '../HeroSection'

describe('HeroSection', () => {
  it('renderiza título y CTAs', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Tus reseñas, leídas por IA/)).toBeInTheDocument()
    expect(screen.getByText('Ver demo')).toBeInTheDocument()
  })
})
