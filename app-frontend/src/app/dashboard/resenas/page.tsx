'use client';

import { useState, useMemo } from 'react';
import { useBusiness } from '@/features/dashboard/components/BusinessContext';
import { mapDashboardReviewToItem } from '@/features/dashboard/mappers/review';
import { useReviews } from '@/features/dashboard/hooks/useReviews';
import ResenasScreen from '@/features/dashboard/components/screens/ResenasScreen';

export default function ResenasPage() {
  const { activeBusinessId } = useBusiness();
  const { data, loading, error } = useReviews(activeBusinessId);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const reviews = useMemo(
    () => (data ?? []).map((r) => {
      const item = mapDashboardReviewToItem(r);
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
