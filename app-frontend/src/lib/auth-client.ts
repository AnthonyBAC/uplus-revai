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

  return data;
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

  return data;
}

// ---------- Forgot Password ----------

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch("/api/auth/forgot-password", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error al enviar el correo');
}

// ---------- Update Profile ----------

export async function updateFullName(
  accessToken: string,
  fullName: string
): Promise<void> {
  const res = await fetch("/api/auth/profile", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fullName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error al actualizar el nombre');
}

export async function updateEmail(
  accessToken: string,
  email: string
): Promise<void> {
  const res = await fetch("/api/auth/email", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error al actualizar el correo');
}

export async function updatePassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await fetch("/api/auth/password", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error al cambiar la contraseña');
}

// ---------- Reset Password ----------

export async function resetPassword(
  accessToken: string,
  refreshToken: string,
  newPassword: string
): Promise<void> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken, refreshToken, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error al restablecer la contraseña');
}