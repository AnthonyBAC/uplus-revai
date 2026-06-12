import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsTabs from '../SettingsTabs'

describe('SettingsTabs', () => {
  it('renderiza 3 tabs', () => {
    render(<SettingsTabs activeTab="name" onChange={vi.fn()} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Contraseña')).toBeInTheDocument()
  })

  it('tab activo tiene clase active', () => {
    render(<SettingsTabs activeTab="email" onChange={vi.fn()} />)
    const emailBtn = screen.getByText('Correo')
    expect(emailBtn.className).toContain('tabActive')
  })

  it('llama onChange al clickear', async () => {
    const onChange = vi.fn()
    render(<SettingsTabs activeTab="name" onChange={onChange} />)
    await userEvent.click(screen.getByText('Contraseña'))
    expect(onChange).toHaveBeenCalledWith('password')
  })
})
