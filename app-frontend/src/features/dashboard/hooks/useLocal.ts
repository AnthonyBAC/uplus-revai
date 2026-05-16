'use client';

import { useState } from 'react';
import type { MembershipInfo } from '@/types/api/session';

interface Integration {
  id: string;
  name: string;
  note: string;
  color: string;
  connected: boolean;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

export interface LocalData {
  name: string;
  hours: string;
  phone: string;
  integrations: Integration[];
  team: TeamMember[];
}

const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: 'g', name: 'Google Business', note: 'Reseñas y horarios',  color: '#4285F4', connected: false },
  { id: 't', name: 'TripAdvisor',     note: 'Reseñas de turismo',  color: '#34E0A1', connected: false },
  { id: 'i', name: 'Instagram',       note: 'Menciones y DMs',     color: '#E1306C', connected: false },
  { id: 'r', name: 'Rappi',           note: 'Pedidos y rating',    color: '#FF441F', connected: false },
  { id: 'f', name: 'Facebook',        note: 'Página y reseñas',    color: '#1877F2', connected: false },
  { id: 'm', name: 'Mercado Pago',    note: 'Notas de pago',       color: '#00B1EA', connected: false },
];

export function useLocal(membership: MembershipInfo | null) {
  const [data, setData] = useState<LocalData>({
    name: membership?.businessName ?? '',
    hours: '',
    phone: '',
    integrations: DEFAULT_INTEGRATIONS,
    team: membership
      ? [{ name: membership.businessName, email: '', role: membership.role }]
      : [],
  });

  const toggleIntegration = (id: string) => {
    setData((prev) => ({
      ...prev,
      integrations: prev.integrations.map((c) =>
        c.id === id ? { ...c, connected: !c.connected } : c
      ),
    }));
  };

  const updateField = (field: keyof Pick<LocalData, 'name' | 'hours' | 'phone'>, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return { data, updateField, toggleIntegration };
}
