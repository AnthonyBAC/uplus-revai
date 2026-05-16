import type { SessionResponse } from '@/types/api/session';

// ---------- Tipos ----------

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  profile: SessionResponse;
}

// ---------- Mapper interno ----------

interface AuthResponsePayload {
  user: {
    supabaseUserId: string;
    appUserId: string | null;
    email: string;
    fullName: string | null;
    isOnboarded: boolean;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number | null;
    expiresIn: number | null;
    tokenType: string;
  } | null;
  requiresEmailConfirmation?: boolean;
}

function toAuthSession(data: AuthResponsePayload): AuthSession {
  return {
    accessToken: data.session?.accessToken ?? '',
    refreshToken: data.session?.refreshToken ?? '',
    profile: data.user,
  };
}

// ---------- Helper interno para requests simples ----------

async function authRequest<T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    token?: string | null;
  },
): Promise<T> {
  const { method = 'GET', body, token } = options ?? {};

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api/auth${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error en la solicitud');

  return data as T;
}

// ---------- Login ----------

export async function login(email: string, password: string): Promise<AuthSession> {
  const data = await authRequest<AuthResponsePayload>('/login', {
    method: 'POST',
    body: { email, password },
  });
  return toAuthSession(data);
}

// ---------- Signup ----------

export async function signup(email: string, password: string, fullName: string): Promise<void> {
  await authRequest<void>('/signup', {
    method: 'POST',
    body: { email, password, fullName },
  });
}

// ---------- Logout ----------

export async function logout(accessToken: string): Promise<void> {
  await authRequest<void>('/logout', { method: 'POST', token: accessToken });
}

// ---------- Register Business ----------

export interface RegisterBusinessInput {
  fullName: string;
  businessName: string;
  businessSlug: string;
}

export interface RegisterBusinessResult {
  userId: string;
  businessId: string;
  businessSlug: string;
  branchId: string;
}

export async function registerBusiness(
  input: RegisterBusinessInput,
  accessToken: string,
): Promise<RegisterBusinessResult> {
  return authRequest<RegisterBusinessResult>('/register', {
    method: 'POST',
    body: input,
    token: accessToken,
  });
}

// ---------- Refresh ----------

export async function refresh(refreshToken: string): Promise<AuthSession> {
  const data = await authRequest<AuthResponsePayload>('/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
  return toAuthSession(data);
}

// ---------- Forgot Password ----------

export async function forgotPassword(email: string): Promise<void> {
  await authRequest<void>('/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

// ---------- Update Profile ----------

export async function updateFullName(accessToken: string, fullName: string): Promise<void> {
  await authRequest<void>('/profile', {
    method: 'PATCH',
    body: { fullName },
    token: accessToken,
  });
}

export async function updateEmail(accessToken: string, email: string): Promise<void> {
  await authRequest<void>('/email', {
    method: 'PATCH',
    body: { email },
    token: accessToken,
  });
}

export async function updatePassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await authRequest<void>('/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
    token: accessToken,
  });
}

// ---------- Reset Password ----------

export async function resetPassword(
  accessToken: string,
  refreshToken: string,
  newPassword: string,
): Promise<void> {
  await authRequest<void>('/reset-password', {
    method: 'POST',
    body: { accessToken, refreshToken, newPassword },
  });
}
