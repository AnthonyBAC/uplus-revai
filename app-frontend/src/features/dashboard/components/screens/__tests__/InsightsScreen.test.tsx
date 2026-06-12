import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import InsightsScreen from '../InsightsScreen'
import type { InsightsData } from '@/features/dashboard/hooks/useInsights'

const data: InsightsData = {
  businessId: 'b1',
  ratingTrend: [4.1, 4.2, 4.3],
  volumeTrend: [10, 12, 15],
  themes: [{ name: 'Atención', sentiment: 'positivo', mentions: 8, trend: 2 }],
}

describe('InsightsScreen', () => {
  it('renderiza título y datos', () => {
    render(<InsightsScreen data={data} loading={false} />)
    expect(screen.getByText('Insights')).toBeInTheDocument()
  })

  it('muestra loading', () => {
    render(<InsightsScreen data={null} loading={true} />)
    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })
})
