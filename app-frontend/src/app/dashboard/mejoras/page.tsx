'use client';

import MejorasScreen from '@/features/dashboard/components/screens/MejorasScreen';
import { useActions } from '@/features/dashboard/hooks/useActions';

export default function MejorasPage() {
  const { actions, update } = useActions();

  return <MejorasScreen actions={actions} onUpdate={update} totalReviews={0} />;
}
