import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Field from '../Field'

describe('Field', () => {
  it('renderiza label e input', () => {
    render(<Field label="Nombre" value="Juan" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
  })

  it('dispara onChange al escribir', async () => {
    const onChange = vi.fn()
    render(<Field label="Nombre" value="" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Nombre'), 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })

  it('deshabilita input si loading', () => {
    render(<Field label="X" value="" onChange={vi.fn()} loading />)
    expect(screen.getByLabelText('X')).toBeDisabled()
  })

  it('muestra placeholder', () => {
    render(<Field label="X" value="" onChange={vi.fn()} placeholder="Ingresa..." />)
    expect(screen.getByPlaceholderText('Ingresa...')).toBeInTheDocument()
  })
})
