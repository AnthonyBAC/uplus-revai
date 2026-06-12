import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from '../Card'

describe('Card', () => {
  it('renderiza children en un div por defecto', () => {
    render(<Card>Contenido</Card>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
    expect(screen.getByText('Contenido').tagName).toBe('DIV')
  })

  it('renderiza button si tiene onClick', () => {
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Clickable</Card>)
    const el = screen.getByText('Clickable')
    expect(el.tagName).toBe('BUTTON')
    expect(el).toHaveAttribute('type', 'button')
  })

  it('dispara onClick', async () => {
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Click</Card>)
    await userEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalled()
  })

  it('aplica clase hover si hover=true', () => {
    render(<Card hover>X</Card>)
    const el = screen.getByText('X')
    expect(el.className).toContain('hover')
  })

  it('aplica className adicional', () => {
    render(<Card className="extra">X</Card>)
    expect(screen.getByText('X').className).toContain('extra')
  })
})
