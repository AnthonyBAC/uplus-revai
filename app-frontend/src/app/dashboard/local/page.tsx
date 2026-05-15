'use client';

import LocalScreen from '@/features/dashboard/components/screens/LocalScreen';
import { useLocal } from '@/features/dashboard/hooks/useLocal';
import { useBusiness } from '@/features/dashboard/components/BusinessContext';

export default function LocalPage() {
  const { activeMembership } = useBusiness();
  const { data, updateField, toggleIntegration } = useLocal(activeMembership ?? null);

  return (
    <LocalScreen
      data={data}
      onUpdateField={updateField}
      onToggleIntegration={toggleIntegration}
    />
  );
}
