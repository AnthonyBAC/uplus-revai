import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Field from '../Field'

describe('Field', () => {
  it('renderiza label e input', () => {
    render(<Field label="Nombre" value="Juan" onChange={vi.fn()} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
  })

  it('dispara onChange al escribir', async () => {
    const onChange = vi.fn()
    render(<Field label="Nombre" value="" onChange={onChange} />)
    await userEvent.type(screen.getByDisplayValue(''), 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })
})
