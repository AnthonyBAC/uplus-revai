'use client';

import InsightsScreen from '@/components/dashboard/screens/InsightsScreen';
import { useInsights } from '@/hooks/useInsights';
import { useBusiness } from '@/components/dashboard/BusinessContext';

export default function InsightsPage() {
  const { activeBusinessId } = useBusiness();
  const { data, loading } = useInsights(activeBusinessId ?? '');

  return <InsightsScreen data={data} loading={loading} />;
}
