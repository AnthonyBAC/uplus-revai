import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Toast from '../Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no renderiza si msg está vacío', () => {
    const { container } = render(<Toast msg="" onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza mensaje cuando msg tiene texto', () => {
    render(<Toast msg="Guardado!" onClose={vi.fn()} />)
    expect(screen.getByText('Guardado!')).toBeInTheDocument()
  })

  it('llama onClose después de 2400ms', () => {
    const onClose = vi.fn()
    render(<Toast msg="Guardado!" onClose={onClose} />)

    act(() => vi.advanceTimersByTime(2400))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('limpia timeout si msg cambia a vacío', () => {
    const onClose = vi.fn()
    const { rerender } = render(<Toast msg="Hola" onClose={onClose} />)

    rerender(<Toast msg="" onClose={onClose} />)
    act(() => vi.advanceTimersByTime(2400))
    expect(onClose).not.toHaveBeenCalled()
  })
})
