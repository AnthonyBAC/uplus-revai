'use client';

import { useEffect, useState } from 'react';
import { useBusiness } from '@/components/dashboard/BusinessContext';
import { useSession } from '@/hooks/useSession';
import { useDashboard } from '@/hooks/useDashboard';
import ResumenScreen from '@/components/dashboard/screens/ResumenScreen';
import type { DashboardReview } from '@/types/api/dashboard';
import type { ReviewItem } from '@/components/dashboard/ReviewCard';

function toItem(r: DashboardReview): ReviewItem {
  const name = r.authorName ?? 'Anónimo';
  return {
    id: r.id,
    name,
    initial: name[0]?.toUpperCase() ?? '?',
    rating: r.rating,
    date: new Date(r.publishedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
    source: r.source,
    text: r.content,
    tags: [],
    reply: null,
  };
}

export default function DashboardPage() {
  const { activeBusinessId, activeMembership } = useBusiness();
  const { session } = useSession();
  const { data, loading } = useDashboard(activeBusinessId);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    if (data?.data.reviews) {
      setReviews(data.data.reviews.map(toItem));
    }
  }, [data]);

  return (
    <ResumenScreen
      data={data}
      loading={loading}
      reviews={reviews}
      onReply={(id, text) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply: text } : r))}
      userName={session?.fullName}
      businessName={activeMembership?.businessName}
    />
  );
}
