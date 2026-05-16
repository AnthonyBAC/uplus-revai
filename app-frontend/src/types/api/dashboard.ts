export interface DashboardReview {
  id: string;
  businessId: string;
  branchId?: string | null;
  source: string;
  externalId: string;
  authorName?: string | null;
  rating: number;
  content: string;
  publishedAt: string;
}

interface DashboardReport {
  id: string;
  businessId: string;
  title: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

interface DashboardSurvey {
  id: string;
  businessId: string;
  title: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardResponse {
  businessId: string;
  reviews: number;
  surveys: number;
  reports: number;
  data: {
    reviews: DashboardReview[];
    surveys: DashboardSurvey[];
    reports: DashboardReport[];
  };
}

interface InsightsTheme {
  name: string;
  sentiment: 'positivo' | 'negativo' | 'neutro';
  mentions: number;
  trend: number;
}

export interface InsightsResponse {
  businessId: string;
  branchId?: string;
  ratingTrend: number[];
  volumeTrend: number[];
  themes: InsightsTheme[];
}

type ImprovementActionStatus = 'sugerida' | 'en-curso' | 'completada' | 'descartada';
type ImprovementActionImpact = 'alto' | 'medio' | 'bajo';

export interface ImprovementAction {
  id: string;
  title: string;
  why: string;
  impact: ImprovementActionImpact;
  steps: number;
  eta: string;
  status: ImprovementActionStatus;
  progress: number;
  tag: string;
  detail: string[];
}

export interface ImprovementsResponse {
  businessId: string;
  branchId?: string;
  totalReviews: number;
  actions: ImprovementAction[];
}
