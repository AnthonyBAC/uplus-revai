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

export function useInsights(): UseInsightsResult {
  return {
    data: null,
    loading: false,
    error: null,
  };
}
