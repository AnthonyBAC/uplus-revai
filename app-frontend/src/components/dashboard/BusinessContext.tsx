'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MembershipInfo } from '@/types/api/session';

interface BusinessContextValue {
  memberships: MembershipInfo[];
  activeBusinessId: string | null;
  activeMembership: MembershipInfo | null;
  setActiveBusinessId: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextValue>({
  memberships: [],
  activeBusinessId: null,
  activeMembership: null,
  setActiveBusinessId: () => {},
});

const STORAGE_KEY = 'uplus_active_business_id';

export function BusinessProvider({
  memberships,
  children,
}: {
  memberships: MembershipInfo[];
  children: ReactNode;
}) {
  const [activeBusinessId, setActiveBusinessIdState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return memberships[0]?.businessId ?? null;
    const stored = localStorage.getItem(STORAGE_KEY);
    const valid = memberships.find((m) => m.businessId === stored);
    return valid ? stored : (memberships[0]?.businessId ?? null);
  });

  useEffect(() => {
    if (activeBusinessId) {
      localStorage.setItem(STORAGE_KEY, activeBusinessId);
    }
  }, [activeBusinessId]);

  const setActiveBusinessId = (id: string) => {
    setActiveBusinessIdState(id);
  };

  const activeMembership = memberships.find((m) => m.businessId === activeBusinessId) ?? null;

  return (
    <BusinessContext.Provider value={{ memberships, activeBusinessId, activeMembership, setActiveBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
