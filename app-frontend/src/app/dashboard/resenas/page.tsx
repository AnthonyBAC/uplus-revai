'use client';

import { useEffect, useState } from 'react';
import { useBusiness } from '@/components/dashboard/BusinessContext';
import { useReviews } from '@/hooks/useReviews';
import ResenasScreen from '@/components/dashboard/screens/ResenasScreen';
import type { ReviewItem } from '@/components/dashboard/ReviewCard';
import type { Review } from '@/types/api/reviews';

function toItem(r: Review): ReviewItem {
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
    reply: r.reply ?? null,
  };
}

export default function ResenasPage() {
  const { activeBusinessId } = useBusiness();
  const { data, loading, error } = useReviews(activeBusinessId ?? '');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    if (data) {
      setReviews(data.map(toItem));
    }
  }, [data]);

  return (
    <ResenasScreen
      reviews={reviews}
      loading={loading}
      error={error}
      onReply={(id, text) =>
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text } : r)))
      }
    />
  );
}
