'use client';

import { useState, useMemo } from 'react';
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
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const reviews = useMemo(
    () => (data?.data.reviews ?? []).map((r) => {
      const item = toItem(r);
      return replyMap[item.id] ? { ...item, reply: replyMap[item.id] } : item;
    }),
    [data, replyMap],
  );

  return (
    <ResumenScreen
      data={data}
      loading={loading}
      reviews={reviews}
      onReply={(id, text) => setReplyMap((prev) => ({ ...prev, [id]: text }))}
      userName={session?.fullName}
      businessName={activeMembership?.businessName}
    />
  );
}
