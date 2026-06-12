import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Donut, { DonutDatum } from '../Donut'

const sampleData: DonutDatum[] = [
  { label: 'Google', value: 15, color: '#D9684D' },
  { label: 'TripAdvisor', value: 5, color: '#4F7A4A' },
]

describe('Donut', () => {
  it('renderiza SVG y leyenda', () => {
    const { container } = render(<Donut data={sampleData} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renderiza centro si se pasa center prop', () => {
    render(<Donut data={sampleData} center={{ value: '4.2', label: 'Rating' }} />)
    expect(screen.getByText('4.2')).toBeInTheDocument()
    expect(screen.getByText('Rating')).toBeInTheDocument()
  })

  it('renderiza círculo vacío si no hay datos', () => {
    const { container } = render(<Donut data={[]} />)
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('size personalizado', () => {
    const { container } = render(<Donut data={sampleData} size={200} thickness={30} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('200')
  })
})
