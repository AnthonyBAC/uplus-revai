import type { SessionResponse } from '@/types/api/session';
import type { DashboardResponse } from '@/types/api/dashboard';
import type { Review } from '@/types/api/reviews';

export const MOCK_SESSION: SessionResponse = {
  id: 'mock-user-1',
  email: 'demo@uplus.cl',
  fullName: 'Daniela Ortiz',
  memberships: [
    {
      businessId: 'mock-biz-1',
      businessName: 'La Terraza',
      businessSlug: 'la-terraza',
      role: 'owner',
      branchId: 'mock-branch-1',
      branchName: 'Sucursal Principal',
    },
  ],
};

export const MOCK_DASHBOARD: DashboardResponse = {
  businessId: 'mock-biz-1',
  reviews: 142,
  surveys: 3,
  reports: 2,
  data: {
    reviews: [
      {
        id: 'r1',
        businessId: 'mock-biz-1',
        branchId: 'mock-branch-1',
        connectionId: 'c1',
        source: 'Google',
        externalId: 'ext-1',
        authorName: 'Camila Torres',
        authorExternalId: null,
        rating: 5,
        content: 'Excelente atención, el ambiente es increíble y la comida deliciosa. Volvería mil veces.',
        language: 'es',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        fetchedAt: new Date().toISOString(),
      },
      {
        id: 'r2',
        businessId: 'mock-biz-1',
        branchId: 'mock-branch-1',
        connectionId: 'c1',
        source: 'Google',
        externalId: 'ext-2',
        authorName: 'Rodrigo Méndez',
        authorExternalId: null,
        rating: 4,
        content: 'Muy buen lugar, la terraza es espectacular. El servicio fue un poco lento pero la calidad lo compensa.',
        language: 'es',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        fetchedAt: new Date().toISOString(),
      },
      {
        id: 'r3',
        businessId: 'mock-biz-1',
        branchId: 'mock-branch-1',
        connectionId: 'c1',
        source: 'TripAdvisor',
        externalId: 'ext-3',
        authorName: 'Valentina Ríos',
        authorExternalId: null,
        rating: 2,
        content: 'Esperamos más de 40 minutos para que nos tomaran el pedido. La comida llegó fría. No volveríamos.',
        language: 'es',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        fetchedAt: new Date().toISOString(),
      },
      {
        id: 'r4',
        businessId: 'mock-biz-1',
        branchId: 'mock-branch-1',
        connectionId: 'c1',
        source: 'Google',
        externalId: 'ext-4',
        authorName: 'Felipe Contreras',
        authorExternalId: null,
        rating: 5,
        content: 'Uno de mis restaurantes favoritos. Siempre consistente en calidad y trato.',
        language: 'es',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        fetchedAt: new Date().toISOString(),
      },
      {
        id: 'r5',
        businessId: 'mock-biz-1',
        branchId: 'mock-branch-1',
        connectionId: 'c1',
        source: 'Google',
        externalId: 'ext-5',
        authorName: 'Ana Morales',
        authorExternalId: null,
        rating: 3,
        content: 'Lugar bonito pero los precios son un poco altos para lo que ofrecen. El postre estuvo rico.',
        language: 'es',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        fetchedAt: new Date().toISOString(),
      },
    ],
    surveys: [],
    reports: [
      {
        id: 'rep1',
        businessId: 'mock-biz-1',
        title: 'Reporte mensual — Abril 2025',
        periodStart: '2025-04-01',
        periodEnd: '2025-04-30',
        status: 'listo',
      },
      {
        id: 'rep2',
        businessId: 'mock-biz-1',
        title: 'Reporte mensual — Marzo 2025',
        periodStart: '2025-03-01',
        periodEnd: '2025-03-31',
        status: 'listo',
      },
    ],
  },
};

export const MOCK_REVIEWS: Review[] = MOCK_DASHBOARD.data.reviews.map((r) => ({
  ...r,
  reply: null,
}));

export function mockApiFetch(path: string): unknown {
  if (path.startsWith('/analysis/dashboard')) return MOCK_DASHBOARD;
  if (path.startsWith('/review/reviews')) return MOCK_REVIEWS;
  return null;
}
