'use client';

import { useState, useMemo } from 'react';
import { useBusiness } from '@/components/dashboard/BusinessContext';
import { useReviews } from '@/hooks/useReviews';
import ResenasScreen from '@/components/dashboard/screens/ResenasScreen';
import type { ReviewItem } from '@/components/dashboard/ReviewCard';
import type { DashboardReview } from '@/types/api/dashboard';

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

export default function ResenasPage() {
  const { activeBusinessId } = useBusiness();
  const { data, loading, error } = useReviews(activeBusinessId ?? '');
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const reviews = useMemo(
    () => (data ?? []).map((r) => {
      const item = toItem(r);
      return replyMap[item.id] ? { ...item, reply: replyMap[item.id] } : item;
    }),
    [data, replyMap],
  );

  return (
    <ResenasScreen
      reviews={reviews}
      loading={loading}
      error={error}
      onReply={(id, text) => setReplyMap((prev) => ({ ...prev, [id]: text }))}
    />
  );
}
