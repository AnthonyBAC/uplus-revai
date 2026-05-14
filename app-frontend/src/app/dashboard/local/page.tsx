'use client';

import LocalScreen from '@/components/dashboard/screens/LocalScreen';
import { useLocal } from '@/hooks/useLocal';
import { useBusiness } from '@/components/dashboard/BusinessContext';

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
