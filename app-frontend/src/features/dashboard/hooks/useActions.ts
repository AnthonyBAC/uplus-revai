'use client';

import { useMemo, useState } from 'react';
import { fetchImprovements } from '@/features/dashboard/services/improvements';
import { useAsyncResource } from '@/features/dashboard/hooks/shared/useAsyncResource';
import type {
  ImprovementAction,
  ImprovementsResponse,
} from '@/types/api/dashboard';

export type Action = ImprovementAction;

export function useActions(businessId: string | null) {
  const [overridesByBusiness, setOverridesByBusiness] = useState<Record<string, Record<string, Partial<Action>>>>({});
  const { data, loading, error, refetch } = useAsyncResource<ImprovementsResponse>({
    enabled: !!businessId,
    deps: [businessId],
    fetcher: () => fetchImprovements(businessId as string),
    cacheKey: businessId ? `uplus_cache_improvements_${businessId}` : undefined,
  });

  const activeOverrides = useMemo(
    () => (businessId ? (overridesByBusiness[businessId] ?? {}) : {}),
    [businessId, overridesByBusiness]
  );

  const actions = useMemo(
    () => (data?.actions ?? []).map((action) => ({ ...action, ...(activeOverrides[action.id] ?? {}) })),
    [activeOverrides, data]
  );

  const update = (id: string, patch: Partial<Action>) => {
    if (!businessId) return;

    setOverridesByBusiness((prev) => ({
      ...prev,
      [businessId]: {
        ...(prev[businessId] ?? {}),
        [id]: { ...(prev[businessId]?.[id] ?? {}), ...patch },
      },
    }));
  };

  return {
    actions,
    update,
    loading,
    error,
    totalReviews: data?.totalReviews ?? 0,
    refetch,
  };
}
