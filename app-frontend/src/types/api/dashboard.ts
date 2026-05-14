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

export interface DashboardReport {
  id: string;
  businessId: string;
  title: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface DashboardSurvey {
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
