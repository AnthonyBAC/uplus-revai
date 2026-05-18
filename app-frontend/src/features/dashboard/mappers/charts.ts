import type { DashboardReview } from '@/types/api/dashboard';
import type { BarDatum } from '../components/primitives/BarChart';
import type { DonutDatum } from '../components/primitives/Donut';

const SOURCE_PALETTE = ['#D9684D', '#4F7A4A', '#C28427', '#1877F2', '#8E827A', '#34E0A1'];

/**
 * Distribución de reseñas por rating (5★ → 1★).
 * Colores semánticos: ≥4 verde, 3 amarillo, ≤2 rojo.
 */
export function getStarDistribution(reviews: DashboardReview[]): BarDatum[] {
  return [5, 4, 3, 2, 1].map((star) => ({
    label: `${star}★`,
    value: reviews.filter((r) => r.rating === star).length,
    color:
      star >= 4 ? 'var(--good)' : star === 3 ? 'var(--warn)' : 'var(--bad)',
  }));
}

/**
 * Distribución de reseñas por fuente (Google, TripAdvisor, etc.).
 */
export function getSourceDistribution(reviews: DashboardReview[]): DonutDatum[] {
  const counts = new Map<string, number>();
  reviews.forEach((r) => counts.set(r.source, (counts.get(r.source) ?? 0) + 1));
  return Array.from(counts.entries()).map(([label, value], i) => ({
    label,
    value,
    color: SOURCE_PALETTE[i % SOURCE_PALETTE.length],
  }));
}

/**
 * Sentimiento derivado del rating numérico:
 * - ≥4 → positiva
 * - =3 → neutra
 * - ≤2 → negativa
 */
export function getSentimentFromRatings(reviews: DashboardReview[]): DonutDatum[] {
  const pos = reviews.filter((r) => r.rating >= 4).length;
  const neu = reviews.filter((r) => r.rating === 3).length;
  const neg = reviews.filter((r) => r.rating <= 2).length;
  return [
    { label: 'Positivas', value: pos, color: 'var(--good)' },
    { label: 'Neutras',   value: neu, color: '#D6C7B5' },
    { label: 'Negativas', value: neg, color: 'var(--bad)' },
  ];
}

/**
 * Porcentaje de reseñas positivas (rating ≥4) sobre el total.
 * Retorna 0 si no hay reseñas.
 */
export function getPositiveRate(reviews: DashboardReview[]): number {
  if (reviews.length === 0) return 0;
  const pos = reviews.filter((r) => r.rating >= 4).length;
  return Math.round((pos / reviews.length) * 100);
}
