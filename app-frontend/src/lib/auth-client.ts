// ---------- Tipos ----------

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface AuthError {
  error: string;
}

// ---------- Login ----------

export async function login(
  email: string,
  password: string
): Promise<AuthSession> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error ?? "Error al iniciar sesión");

  return {
    accessToken: data.session.accessToken,
    refreshToken: data.session.refreshToken,
    user: data.user,
  };
}

// ---------- Signup ----------

export async function signup(
  email: string,
  password: string,
  fullName: string
): Promise<void> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error ?? "Error al crear la cuenta");
}

// ---------- Logout ----------

export async function logout(accessToken: string): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// ---------- Session ----------

export async function getSession(
  accessToken: string
): Promise<AuthSession> {
  const res = await fetch("/api/auth/session", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error ?? "Sesión inválida");

  return data;
}

// ---------- Refresh ----------

export async function refresh(
  refreshToken: string
): Promise<AuthSession> {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error ?? "No se pudo renovar la sesión");

  return {
    accessToken: data.session.accessToken,
    refreshToken: data.session.refreshToken,
    user: data.user,
  };
}
