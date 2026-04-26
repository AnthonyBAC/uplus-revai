export const serviceUrls = {
    auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? '',
    review: process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL ?? '',
    analysis: process.env.NEXT_PUBLIC_ANALYSIS_SERVICE_URL ?? '',
    report: process.env.NEXT_PUBLIC_REPORT_SERVICE_URL ?? '',
    surveys: process.env.NEXT_PUBLIC_SURVEYS_SERVICE_URL ?? '',
} as const;
