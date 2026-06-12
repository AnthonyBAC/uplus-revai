import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PasswordTab from '../PasswordTab'

describe('PasswordTab', () => {
  const props = {
    currentPassword: '', newPassword: '', showCurrent: false, showNew: false, loading: false,
    onCurrentPasswordChange: vi.fn(), onNewPasswordChange: vi.fn(),
    onToggleCurrent: vi.fn(), onToggleNew: vi.fn(),
  }

  it('renderiza 2 campos de contraseña', () => {
    render(<PasswordTab {...props} />)
    expect(screen.getByLabelText('Contraseña actual')).toBeInTheDocument()
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
  })

  it('toggle cambia visibilidad', async () => {
    const onToggle = vi.fn()
    render(<PasswordTab {...props} onToggleCurrent={onToggle} />)
    await userEvent.click(screen.getAllByText('VER')[0])
    expect(onToggle).toHaveBeenCalled()
  })

  it('deshabilita inputs si loading', () => {
    render(<PasswordTab {...props} loading={true} />)
    expect(screen.getByLabelText('Contraseña actual')).toBeDisabled()
    expect(screen.getByLabelText('Nueva contraseña')).toBeDisabled()
  })
})
