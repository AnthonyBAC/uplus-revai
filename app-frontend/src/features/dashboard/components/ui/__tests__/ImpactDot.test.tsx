import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ImpactDot from '../ui/ImpactDot'

describe('ImpactDot', () => {
  it('alto es rojo', () => {
    const { container } = render(<ImpactDot level="alto" />)
    const dot = container.firstChild as HTMLElement
    expect(dot.style.backgroundColor).toBe('rgb(217, 104, 77)')
  })

  it('medio es amarillo', () => {
    const { container } = render(<ImpactDot level="medio" />)
    const dot = container.firstChild as HTMLElement
    expect(dot.style.backgroundColor).toBe('rgb(194, 132, 39)')
  })

  it('bajo es verde', () => {
    const { container } = render(<ImpactDot level="bajo" />)
    const dot = container.firstChild as HTMLElement
    expect(dot.style.backgroundColor).toBe('rgb(79, 122, 74)')
  })
})
