import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ImpactDot from '../ImpactDot'

describe('ImpactDot', () => {
  it('renderiza span con dimensiones', () => {
    const { container } = render(<ImpactDot impact="alto" />)
    const dot = container.firstChild as HTMLElement
    expect(dot.tagName).toBe('SPAN')
    expect(dot.style.width).toBe('7px')
    expect(dot.style.height).toBe('7px')
    expect(dot.style.display).toBe('inline-block')
  })

  it('aplica colores CSS var por impacto', () => {
    const { container: c1 } = render(<ImpactDot impact="alto" />)
    expect((c1.firstChild as HTMLElement).style.getPropertyValue('background')).toContain('var(--bad)')

    const { container: c2 } = render(<ImpactDot impact="medio" />)
    expect((c2.firstChild as HTMLElement).style.getPropertyValue('background')).toContain('var(--warn)')

    const { container: c3 } = render(<ImpactDot impact="bajo" />)
    expect((c3.firstChild as HTMLElement).style.getPropertyValue('background')).toContain('var(--good)')
  })
})
