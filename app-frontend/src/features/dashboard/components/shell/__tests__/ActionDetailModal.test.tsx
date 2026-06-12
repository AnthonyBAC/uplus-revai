import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionDetailModal from '../shell/ActionDetailModal'
import type { Action } from '@/features/dashboard/hooks/useActions'

const action: Action = {
  id: 'a1', title: 'Mejorar tiempos', why: 'Muchas quejas de demora', impact: 'alto',
  steps: 3, eta: '2 semanas', status: 'sugerida', progress: 0, tag: 'Tiempo',
  detail: ['Paso 1: Identificar horas pico', 'Paso 2: Redistribuir personal'],
}

describe('ActionDetailModal', () => {
  it('renderiza título y detalle', () => {
    render(<ActionDetailModal action={action} onClose={vi.fn()} onStatusChange={vi.fn()} />)
    expect(screen.getByText('Mejorar tiempos')).toBeInTheDocument()
    expect(screen.getByText('Muchas quejas de demora')).toBeInTheDocument()
    expect(screen.getByText('Paso 1: Identificar horas pico')).toBeInTheDocument()
  })

  it('llama onClose al clickear cerrar', async () => {
    const onClose = vi.fn()
    render(<ActionDetailModal action={action} onClose={onClose} onStatusChange={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('muestra pasos del detalle', () => {
    render(<ActionDetailModal action={action} onClose={vi.fn()} onStatusChange={vi.fn()} />)
    expect(screen.getByText('Paso 2: Redistribuir personal')).toBeInTheDocument()
  })
})
