import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MejorasScreen from '../MejorasScreen'
import type { Action } from '@/features/dashboard/hooks/useActions'

const actions: Action[] = [
  { id: 'a1', title: 'Mejorar tiempos', why: 'Demoras', impact: 'alto', steps: 3, eta: '2 semanas', status: 'sugerida', progress: 0, tag: 'Tiempo', detail: [] },
  { id: 'a2', title: 'Capacitar personal', why: 'Inconsistente', impact: 'medio', steps: 2, eta: '1 mes', status: 'en-curso', progress: 40, tag: 'Personal', detail: [] },
]

describe('MejorasScreen', () => {
  it('renderiza lista de acciones', () => {
    render(<MejorasScreen actions={actions} onUpdate={vi.fn()} totalReviews={42} loading={false} error={null} />)
    expect(screen.getByText('Mejorar tiempos')).toBeInTheDocument()
    expect(screen.getByText('Capacitar personal')).toBeInTheDocument()
  })

  it('muestra total de reseñas analizadas', () => {
    render(<MejorasScreen actions={actions} onUpdate={vi.fn()} totalReviews={42} loading={false} error={null} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('muestra loading', () => {
    render(<MejorasScreen actions={[]} onUpdate={vi.fn()} totalReviews={0} loading={true} error={null} />)
    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })
})
