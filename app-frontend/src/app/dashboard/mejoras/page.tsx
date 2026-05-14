'use client';

import MejorasScreen from '@/components/dashboard/screens/MejorasScreen';
import { useActions } from '@/hooks/useActions';

export default function MejorasPage() {
  const { actions, update } = useActions();

  return <MejorasScreen actions={actions} onUpdate={update} totalReviews={0} />;
}
