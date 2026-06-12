import { describe, it, expect } from 'vitest'
import { mapDashboardReviewToItem } from '../review'
import type { DashboardReview } from '@/types/api/dashboard'

function baseReview(overrides: Partial<DashboardReview> = {}): DashboardReview {
  return {
    id: 'r1',
    businessId: 'b1',
    source: 'Google',
    externalId: 'ext1',
    rating: 4,
    content: 'Muy buena atención',
    publishedAt: '2025-06-01T12:00:00Z',
    ...overrides,
  }
}

describe('mapDashboardReviewToItem', () => {
  it('mapea campos básicos', () => {
    const item = mapDashboardReviewToItem(baseReview())

    expect(item.id).toBe('r1')
    expect(item.rating).toBe(4)
    expect(item.source).toBe('Google')
    expect(item.text).toBe('Muy buena atención')
    expect(item.tags).toEqual([])
    expect(item.reply).toBeNull()
  })

  it('usa authorName como nombre', () => {
    const item = mapDashboardReviewToItem(baseReview({ authorName: 'Juan Pérez' }))
    expect(item.name).toBe('Juan Pérez')
    expect(item.initial).toBe('J')
  })

  it('usa "Anónimo" si no hay authorName', () => {
    const item = mapDashboardReviewToItem(baseReview({ authorName: null }))
    expect(item.name).toBe('Anónimo')
    expect(item.initial).toBe('A')
  })

  it('toma la primera letra mayúscula', () => {
    const item = mapDashboardReviewToItem(baseReview({ authorName: 'carlos' }))
    expect(item.initial).toBe('C')
  })

  it('formatea fecha en español chileno (día + mes abreviado)', () => {
    const item = mapDashboardReviewToItem(baseReview({ publishedAt: '2025-03-15T08:00:00Z' }))
    expect(item.date).toMatch(/15/)
    expect(item.date).toMatch(/mar/i)
  })
})
