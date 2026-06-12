import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NameTab from '../NameTab'

describe('NameTab', () => {
  it('renderiza input con valor', () => {
    render(<NameTab value="Juan" loading={false} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument()
  })

  it('dispara onChange', async () => {
    const onChange = vi.fn()
    render(<NameTab value="" loading={false} onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Nuevo nombre'), 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })
})
