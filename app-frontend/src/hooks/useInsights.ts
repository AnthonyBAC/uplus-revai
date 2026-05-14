'use client';

import { ratingTrend, volumeTrend, themes, type Theme } from '@/lib/fixtures/insights';

export interface InsightsData {
  ratingTrend: number[];
  volumeTrend: number[];
  themes: Theme[];
  isFixture: true;
}

export function useInsights(_businessId: string | null): InsightsData {
  return { ratingTrend, volumeTrend, themes, isFixture: true };
}
