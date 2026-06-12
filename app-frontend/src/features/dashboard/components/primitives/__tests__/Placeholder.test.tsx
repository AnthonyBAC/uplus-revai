import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Placeholder from '../Placeholder'

describe('Placeholder', () => {
  it('renderiza div con label por defecto', () => {
    const { container } = render(<Placeholder />)
    const div = container.firstChild as HTMLElement
    expect(div.textContent).toBe('image')
  })

  it('renderiza label personalizado', () => {
    const { container } = render(<Placeholder label="Cargando..." />)
    expect(container.firstChild?.textContent).toBe('Cargando...')
  })
})
