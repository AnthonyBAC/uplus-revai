import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Placeholder from '../primitives/Placeholder'

describe('Placeholder', () => {
  it('renderiza div con tamaño', () => {
    const { container } = render(<Placeholder w={100} h={50} />)
    const div = container.firstChild as HTMLElement
    expect(div.style.width).toBe('100px')
    expect(div.style.height).toBe('50px')
  })
})
