import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailTab from '../EmailTab'

describe('EmailTab', () => {
  it('renderiza input y hint', () => {
    render(<EmailTab value="a@b.com" loading={false} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('a@b.com')).toBeInTheDocument()
    expect(screen.getByText(/Te enviaremos un correo/)).toBeInTheDocument()
  })

  it('dispara onChange', async () => {
    const onChange = vi.fn()
    render(<EmailTab value="" loading={false} onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Nuevo correo'), 'x')
    expect(onChange).toHaveBeenCalledWith('x')
  })
})
