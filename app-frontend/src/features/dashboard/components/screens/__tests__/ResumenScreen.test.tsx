import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResumenScreen from '../ResumenScreen'
import type { DashboardResponse } from '@/types/api/dashboard'
import type { ReviewItem } from '../../ReviewCard'

const mockData: DashboardResponse = {
  businessId: 'b1',
  reviews: 128,
  surveys: 45,
  reports: 6,
  data: {
    reviews: [
      { id: 'r1', businessId: 'b1', source: 'Google', externalId: 'e1', authorName: 'Ana', rating: 5, content: 'Genial', publishedAt: '2025-06-01T00:00:00Z' },
      { id: 'r2', businessId: 'b1', source: 'Google', externalId: 'e2', authorName: 'Luis', rating: 2, content: 'Malo', publishedAt: '2025-06-02T00:00:00Z' },
    ],
    surveys: [],
    reports: [],
  },
}

const mockReviews: ReviewItem[] = [
  { id: 'r3', name: 'Carlos', initial: 'C', rating: 4, date: '1 jun', source: 'Google', text: 'Bueno', reply: null },
  { id: 'r4', name: 'Diana', initial: 'D', rating: 5, date: '2 jun', source: 'Google', text: 'Excelente', reply: 'Gracias!' },
]

describe('ResumenScreen', () => {
  it('renderiza KPIs con datos', () => {
    render(
      <ResumenScreen
        data={mockData}
        loading={false}
        reviews={[]}
        onReply={vi.fn()}
        onRefresh={vi.fn()}
        userName="Test"
        businessName="Mi Negocio"
      />,
    )

    expect(screen.getByText('128')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('muestra estado loading', () => {
    render(
      <ResumenScreen
        data={null}
        loading={true}
        reviews={[]}
        onReply={vi.fn()}
        onRefresh={vi.fn()}
      />,
    )

    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })

  it('cuenta reseñas sin responder', () => {
    render(
      <ResumenScreen
        data={mockData}
        loading={false}
        reviews={mockReviews}
        onReply={vi.fn()}
        onRefresh={vi.fn()}
      />,
    )

    expect(screen.getByText('Resumen')).toBeInTheDocument()
  })
})
