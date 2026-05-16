'use client';

import { useState, useMemo } from 'react';
import { useBusiness } from '@/features/dashboard/components/BusinessContext';
import { mapDashboardReviewToItem } from '@/features/dashboard/mappers/review';
import { useSessionContext } from '@/features/auth/components/SessionProvider';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import ResumenScreen from '@/features/dashboard/components/screens/ResumenScreen';

export default function DashboardPage() {
  const { activeBusinessId, activeMembership } = useBusiness();
  const { session } = useSessionContext();
  const { data, loading, refetch } = useDashboard(activeBusinessId);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const reviews = useMemo(
    () => (data?.data.reviews ?? []).map((r) => {
      const item = mapDashboardReviewToItem(r);
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
      onRefresh={refetch}
      userName={session?.fullName}
      businessName={activeMembership?.businessName}
    />
  );
}
