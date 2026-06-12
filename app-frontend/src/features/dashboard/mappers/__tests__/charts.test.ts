import { describe, it, expect } from 'vitest'
import {
  getStarDistribution,
  getSourceDistribution,
  getSentimentFromRatings,
  getPositiveRate,
} from '../charts'
import type { DashboardReview } from '@/types/api/dashboard'

function makeReview(overrides: Partial<DashboardReview> = {}): DashboardReview {
  return {
    id: 'r1',
    businessId: 'b1',
    source: 'Google',
    externalId: 'ext1',
    rating: 4,
    content: '',
    publishedAt: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('getStarDistribution', () => {
  it('retorna 5 barras (5★ a 1★)', () => {
    const result = getStarDistribution([])
    expect(result).toHaveLength(5)
    expect(result.map((d) => d.label)).toEqual(['5★', '4★', '3★', '2★', '1★'])
  })

  it('cuenta correctamente por rating', () => {
    const reviews = [
      makeReview({ id: '1', rating: 5 }),
      makeReview({ id: '2', rating: 5 }),
      makeReview({ id: '3', rating: 4 }),
      makeReview({ id: '4', rating: 3 }),
      makeReview({ id: '5', rating: 1 }),
    ]
    const result = getStarDistribution(reviews)

    const byLabel = Object.fromEntries(result.map((d) => [d.label, d.value]))
    expect(byLabel['5★']).toBe(2)
    expect(byLabel['4★']).toBe(1)
    expect(byLabel['3★']).toBe(1)
    expect(byLabel['2★']).toBe(0)
    expect(byLabel['1★']).toBe(1)
  })

  it('asigna color verde a ≥4★, amarillo a 3★, rojo a ≤2★', () => {
    const result = getStarDistribution([])
    expect(result[0].color).toBe('var(--good)') // 5★
    expect(result[1].color).toBe('var(--good)') // 4★
    expect(result[2].color).toBe('var(--warn)') // 3★
    expect(result[3].color).toBe('var(--bad)') // 2★
    expect(result[4].color).toBe('var(--bad)') // 1★
  })
})

describe('getSourceDistribution', () => {
  it('retorna array vacío sin reviews', () => {
    expect(getSourceDistribution([])).toEqual([])
  })

  it('agrupa por fuente', () => {
    const reviews = [
      makeReview({ id: '1', source: 'Google' }),
      makeReview({ id: '2', source: 'Google' }),
      makeReview({ id: '3', source: 'TripAdvisor' }),
    ]
    const result = getSourceDistribution(reviews)

    expect(result.find((d) => d.label === 'Google')?.value).toBe(2)
    expect(result.find((d) => d.label === 'TripAdvisor')?.value).toBe(1)
  })

  it('asigna color de paleta', () => {
    const reviews = [makeReview({ id: '1', source: 'Google' })]
    const result = getSourceDistribution(reviews)

    expect(result[0].color).toBe('#D9684D')
  })
})

describe('getSentimentFromRatings', () => {
  it('retorna 3 segmentos con labels fijos', () => {
    const result = getSentimentFromRatings([])
    expect(result.map((d) => d.label)).toEqual(['Positivas', 'Neutras', 'Negativas'])
  })

  it('clasifica ≥4 como positivas, 3 como neutras, ≤2 como negativas', () => {
    const reviews = [
      makeReview({ id: '1', rating: 5 }),
      makeReview({ id: '2', rating: 4 }),
      makeReview({ id: '3', rating: 3 }),
      makeReview({ id: '4', rating: 2 }),
      makeReview({ id: '5', rating: 1 }),
    ]
    const result = getSentimentFromRatings(reviews)

    expect(result[0].value).toBe(2) // positivas
    expect(result[1].value).toBe(1) // neutras
    expect(result[2].value).toBe(2) // negativas
  })
})

describe('getPositiveRate', () => {
  it('retorna 0 si no hay reviews', () => {
    expect(getPositiveRate([])).toBe(0)
  })

  it('calcula porcentaje de ≥4★', () => {
    const reviews = [
      makeReview({ id: '1', rating: 5 }),
      makeReview({ id: '2', rating: 4 }),
      makeReview({ id: '3', rating: 3 }),
      makeReview({ id: '4', rating: 2 }),
    ]
    expect(getPositiveRate(reviews)).toBe(50) // 2 de 4
  })

  it('retorna 100 cuando todas son positivas', () => {
    const reviews = [
      makeReview({ id: '1', rating: 5 }),
      makeReview({ id: '2', rating: 4 }),
    ]
    expect(getPositiveRate(reviews)).toBe(100)
  })

  it('retorna 0 cuando ninguna es positiva', () => {
    const reviews = [
      makeReview({ id: '1', rating: 2 }),
      makeReview({ id: '2', rating: 1 }),
    ]
    expect(getPositiveRate(reviews)).toBe(0)
  })
})
