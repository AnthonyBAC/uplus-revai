'use client';

export interface Theme {
  name: string;
  sentiment: 'positivo' | 'negativo' | 'neutro';
  mentions: number;
  trend: number;
}

export interface InsightsData {
  ratingTrend: number[];
  volumeTrend: number[];
  themes: Theme[];
}

export interface UseInsightsResult {
  data: InsightsData | null;
  loading: boolean;
  error: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useInsights(_businessId: string | null): UseInsightsResult {
  return {
    data: null,
    loading: false,
    error: null,
  };
}
