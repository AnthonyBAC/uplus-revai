'use client';

import { getAccessToken, getRefreshToken, saveSession, clearSession } from '@/lib/session';
import { refresh } from '@/lib/auth-client';

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`/api${path}`, { ...init, headers });

  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const renewed = await refresh(refreshToken);
        saveSession(renewed.accessToken, renewed.refreshToken);
        const retryHeaders = { ...headers, Authorization: `Bearer ${renewed.accessToken}` };
        const retry = await fetch(`/api${path}`, { ...init, headers: retryHeaders });
        if (!retry.ok) throw new Error('Unauthorized');
        return retry.json() as Promise<T>;
      } catch {
        clearSession();
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
    }
    clearSession();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error((err as { error?: string }).error ?? 'Error en la solicitud');
  }

  return res.json() as Promise<T>;
}

export default apiFetch;
