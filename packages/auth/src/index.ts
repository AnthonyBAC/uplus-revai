import { createClient } from '@supabase/supabase-js';
import { prisma } from '@uplus/db';

type HeaderReader = {
  headers: {
    get(name: string): string | null;
  };
};

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
  return createClient(url, key);
}

export interface AuthUser {
  appUserId: string;
  supabaseUserId: string;
  email: string;
}

export function getBearerToken(req: HeaderReader): string | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
}

export async function requireAuth(req: HeaderReader): Promise<AuthUser> {
  const token = getBearerToken(req);
  if (!token) {
    throw httpError(401, 'Token no proporcionado');
  }

  return getUserFromToken(token);
}

export async function getUserFromToken(token: string): Promise<AuthUser> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.id || !data.user?.email) {
    throw httpError(401, 'Token inválido o expirado');
  }

  const appUser = await prisma.app_users.findUnique({
    where: { email: data.user.email },
  });

  if (!appUser) {
    throw httpError(401, 'Usuario no registrado en la plataforma');
  }

  return {
    appUserId: appUser.id,
    supabaseUserId: data.user.id,
    email: data.user.email,
  };
}

export async function requireBusinessAccess(
  appUserId: string,
  businessId: string
): Promise<{ membershipId: string; role: string }> {
  const membership = await prisma.business_memberships.findUnique({
    where: { user_id_business_id: { user_id: appUserId, business_id: businessId } },
    include: { roles: true },
  });

  if (!membership || !membership.is_active) {
    throw httpError(403, 'No tienes acceso a este negocio');
  }

  return { membershipId: membership.id, role: membership.roles.name };
}

export async function requireEndpointPermission(
  role: string,
  method: string,
  path: string
): Promise<void> {
  const allowed = await prisma.role_endpoint_permissions.findFirst({
    where: {
      allowed: true,
      role_name: role as never,
      endpoint_key: { not: '' },
      endpoints: {
        method: method as never,
        path,
        is_active: true,
      },
    },
  });

  if (!allowed) {
    throw httpError(403, `Permiso denegado: ${role} no puede acceder a ${method} ${path}`);
  }
}

export function httpError(status: number, message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = status;
  throw error;
}
