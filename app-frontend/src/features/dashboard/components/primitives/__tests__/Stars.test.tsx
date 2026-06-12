import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Stars from '../Stars'

describe('Stars', () => {
  it('renderiza 5 estrellas SVG', () => {
    const { container } = render(<Stars value={3} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(5)
  })

  it('pinta estrellas llenas según value', () => {
    const { container } = render(<Stars value={3} />)
    const svgs = container.querySelectorAll('svg')

    expect(svgs[0].getAttribute('fill')).not.toBe('transparent')
    expect(svgs[1].getAttribute('fill')).not.toBe('transparent')
    expect(svgs[2].getAttribute('fill')).not.toBe('transparent')
    expect(svgs[3].getAttribute('fill')).toBe('transparent')
    expect(svgs[4].getAttribute('fill')).toBe('transparent')
  })

  it('value=5 pinta todas llenas', () => {
    const { container } = render(<Stars value={5} />)
    const svgs = container.querySelectorAll('svg')
    svgs.forEach((svg) => {
      expect(svg.getAttribute('fill')).not.toBe('transparent')
    })
  })

  it('value=0 pinta todas vacías', () => {
    const { container } = render(<Stars value={0} />)
    const svgs = container.querySelectorAll('svg')
    svgs.forEach((svg) => {
      expect(svg.getAttribute('fill')).toBe('transparent')
    })
  })

  it('aplica size por defecto 13', () => {
    const { container } = render(<Stars value={5} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('13')
  })

  it('aplica size personalizado', () => {
    const { container } = render(<Stars value={5} size={20} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('20')
  })

  it('aplica color por defecto', () => {
    const { container } = render(<Stars value={1} />)
    const span = container.firstChild as HTMLElement
    expect(span.style.color).toBe('rgb(217, 104, 77)')
  })
})
