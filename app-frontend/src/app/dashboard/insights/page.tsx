'use client';

import InsightsScreen from '@/features/dashboard/components/screens/InsightsScreen';
import { useInsights } from '@/features/dashboard/hooks/useInsights';
import { useBusiness } from '@/features/dashboard/components/BusinessContext';

export default function InsightsPage() {
  const { activeBusinessId } = useBusiness();
  const { data, loading } = useInsights(activeBusinessId ?? '');

  return <InsightsScreen data={data} loading={loading} />;
}
