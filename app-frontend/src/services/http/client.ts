'use client';

import { getAccessToken, getRefreshToken, saveSession, clearSession } from '@/features/auth/lib/session';
import { refresh } from '@/features/auth/lib/auth-client';

type ApiFetchOptions = RequestInit & { skipRedirect?: boolean };

const inflightGetRequests = new Map<string, Promise<unknown>>();

function buildRequestKey(path: string, init: RequestInit): string | null {
  const method = (init.method ?? 'GET').toUpperCase();
  return method === 'GET' ? `${method}:${path}` : null;
}

async function executeApiFetch<T>(path: string, init: ApiFetchOptions = {}): Promise<T> {
  const { skipRedirect, ...fetchInit } = init;

  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`/api${path}`, { ...fetchInit, headers });

  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const renewed = await refresh(refreshToken);
        saveSession(renewed.accessToken, renewed.refreshToken, renewed.profile);
        const retryHeaders = { ...headers, Authorization: `Bearer ${renewed.accessToken}` };
        const retry = await fetch(`/api${path}`, { ...fetchInit, headers: retryHeaders });
        if (!retry.ok) throw new Error('Unauthorized');
        return retry.json() as Promise<T>;
      } catch {
        clearSession();
        if (!skipRedirect && typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
    }
    clearSession();
    if (!skipRedirect && typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error((err as { error?: string }).error ?? 'Error en la solicitud');
  }

  return res.json() as Promise<T>;
}

async function apiFetch<T>(path: string, init: ApiFetchOptions = {}): Promise<T> {
  const requestKey = buildRequestKey(path, init);

  if (requestKey) {
    const existing = inflightGetRequests.get(requestKey);
    if (existing) return existing as Promise<T>;
  }

  const request = executeApiFetch<T>(path, init);

  if (!requestKey) return request;

  inflightGetRequests.set(requestKey, request as Promise<unknown>);
  try {
    return await request;
  } finally {
    inflightGetRequests.delete(requestKey);
  }
}

export default apiFetch;
