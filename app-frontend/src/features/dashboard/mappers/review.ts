import type { ReviewItem } from '@/features/dashboard/components/ReviewCard';
import type { DashboardReview } from '@/types/api/dashboard';

export function mapDashboardReviewToItem(review: DashboardReview): ReviewItem {
  const name = review.authorName ?? 'Anónimo';

  return {
    id: review.id,
    name,
    initial: name[0]?.toUpperCase() ?? '?',
    rating: review.rating,
    date: new Date(review.publishedAt).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
    }),
    source: review.source,
    text: review.content,
    tags: [],
    reply: null,
  };
}
