import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Sparkline from '../Sparkline'

describe('Sparkline', () => {
  it('renderiza SVG', () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renderiza línea y área', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(2)
  })

  it('sin fill solo renderiza línea', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} fill={false} />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(1)
  })

  it('array vacío renderiza div placeholder', () => {
    const { container } = render(<Sparkline data={[]} />)
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('acepta height personalizado', () => {
    const { container } = render(<Sparkline data={[1, 2]} height={48} />)
    const svg = container.querySelector('svg')!
    expect(svg.style.height).toBe('48px')
  })
})
