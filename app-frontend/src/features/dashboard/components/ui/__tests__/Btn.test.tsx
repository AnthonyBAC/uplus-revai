import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Btn from '../Btn'

describe('Btn', () => {
  it('renderiza children', () => {
    render(<Btn>Click me</Btn>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('por defecto type=button', () => {
    render(<Btn>X</Btn>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('type=submit', () => {
    render(<Btn type="submit">Enviar</Btn>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('dispara onClick', async () => {
    const onClick = vi.fn()
    render(<Btn onClick={onClick}>Click</Btn>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled impide click', async () => {
    const onClick = vi.fn()
    render(<Btn onClick={onClick} disabled>Click</Btn>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('aplica variantes kind y size como clases CSS', () => {
    render(<Btn kind="primary" size="lg">X</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('primary')
    expect(btn.className).toContain('lg')
  })

  it('renderiza icono si se pasa icon prop', () => {
    render(<Btn icon="star">Fav</Btn>)
    const btn = screen.getByRole('button', { name: /Fav/ })
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('no renderiza icono si no se pasa icon', () => {
    render(<Btn>Plain</Btn>)
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()
  })

  it('acepta style prop', () => {
    render(<Btn style={{ color: 'red' }}>X</Btn>)
    expect(screen.getByRole('button').style.color).toBe('red')
  })
})
