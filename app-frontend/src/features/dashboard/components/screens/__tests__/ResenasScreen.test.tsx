import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResenasScreen from '../ResenasScreen'
import type { ReviewItem } from '../../ReviewCard'

const reviews: ReviewItem[] = [
  { id: 'r1', name: 'Ana', initial: 'A', rating: 5, date: '1 jun', source: 'Google', text: 'Genial', reply: null },
  { id: 'r2', name: 'Luis', initial: 'L', rating: 2, date: '2 jun', source: 'Google', text: 'Malo', reply: 'Gracias' },
]

describe('ResenasScreen', () => {
  it('renderiza lista de reseñas', () => {
    render(<ResenasScreen reviews={reviews} loading={false} error={null} onReply={vi.fn()} />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Luis')).toBeInTheDocument()
  })

  it('muestra loading', () => {
    render(<ResenasScreen reviews={[]} loading={true} error={null} onReply={vi.fn()} />)
    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })

  it('muestra error', () => {
    render(<ResenasScreen reviews={[]} loading={false} error="Algo falló" onReply={vi.fn()} />)
    expect(screen.getByText('Algo falló')).toBeInTheDocument()
  })
})
