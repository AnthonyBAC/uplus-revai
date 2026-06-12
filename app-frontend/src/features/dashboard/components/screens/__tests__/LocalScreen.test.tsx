import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocalScreen from '../LocalScreen'
import type { LocalData } from '@/features/dashboard/hooks/useLocal'

const data: LocalData = {
  name: 'Mi Negocio',
  hours: '9:00-18:00',
  phone: '+56912345678',
  integrations: [
    { id: 'g', name: 'Google Business', note: 'Reseñas', color: '#4285F4', connected: false },
    { id: 't', name: 'TripAdvisor', note: 'Turismo', color: '#34E0A1', connected: true },
  ],
  team: [{ name: 'Admin', email: 'a@b.com', role: 'ADMIN' }],
}

describe('LocalScreen', () => {
  it('renderiza nombre del negocio', () => {
    render(<LocalScreen data={data} onUpdateField={vi.fn()} onToggleIntegration={vi.fn()} />)
    expect(screen.getByDisplayValue('Mi Negocio')).toBeInTheDocument()
  })

  it('renderiza integraciones', () => {
    render(<LocalScreen data={data} onUpdateField={vi.fn()} onToggleIntegration={vi.fn()} />)
    expect(screen.getByText('Google Business')).toBeInTheDocument()
    expect(screen.getByText('TripAdvisor')).toBeInTheDocument()
  })

  it('renderiza miembros del equipo', () => {
    render(<LocalScreen data={data} onUpdateField={vi.fn()} onToggleIntegration={vi.fn()} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
