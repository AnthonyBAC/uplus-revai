export const ratingTrend = [4.1, 4.2, 4.0, 4.2, 4.3, 4.4, 4.3, 4.2, 4.4, 4.3, 4.5, 4.3, 4.4, 4.3];
export const volumeTrend = [3, 5, 4, 6, 7, 5, 8, 6, 9, 7, 8, 10, 6, 7];

export interface Theme {
  id: string;
  label: string;
  count: number;
  sentiment: number;
  trend: 'up' | 'down' | 'flat';
}

export const themes: Theme[] = [
  { id: 't1', label: 'Comida',    count: 41, sentiment: 0.78, trend: 'up' },
  { id: 't2', label: 'Servicio',  count: 33, sentiment: 0.71, trend: 'flat' },
  { id: 't3', label: 'Ambiente',  count: 22, sentiment: 0.84, trend: 'up' },
  { id: 't4', label: 'Espera',    count: 14, sentiment: 0.22, trend: 'down' },
  { id: 't5', label: 'Café',      count: 12, sentiment: 0.41, trend: 'down' },
  { id: 't6', label: 'Postres',   count: 11, sentiment: 0.66, trend: 'flat' },
  { id: 't7', label: 'Precios',   count: 9,  sentiment: 0.55, trend: 'flat' },
  { id: 't8', label: 'Terraza',   count: 8,  sentiment: 0.91, trend: 'up' },
];
