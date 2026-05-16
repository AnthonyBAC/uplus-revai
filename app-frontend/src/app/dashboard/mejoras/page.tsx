'use client';

import MejorasScreen from '@/features/dashboard/components/screens/MejorasScreen';
import { useBusiness } from '@/features/dashboard/components/BusinessContext';
import { useActions } from '@/features/dashboard/hooks/useActions';

export default function MejorasPage() {
  const { activeBusinessId } = useBusiness();
  const { actions, update, loading, error, totalReviews } = useActions(activeBusinessId);

  return <MejorasScreen actions={actions} onUpdate={update} totalReviews={totalReviews} loading={loading} error={error} />;
}
