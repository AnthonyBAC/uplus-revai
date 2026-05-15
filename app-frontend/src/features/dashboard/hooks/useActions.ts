'use client';

import { useState } from 'react';

export type ActionStatus = 'sugerida' | 'en-curso' | 'completada' | 'descartada';
export type ActionImpact = 'alto' | 'medio' | 'bajo';

export interface Action {
  id: string;
  title: string;
  why: string;
  impact: ActionImpact;
  steps: number;
  eta: string;
  status: ActionStatus;
  progress: number;
  tag: string;
  detail: string[];
}

export function useActions() {
  const [actions, setActions] = useState<Action[]>([]);

  const update = (id: string, patch: Partial<Action>) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  return { actions, setActions, update };
}
