import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from './prisma';

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

export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw authError('Token no proporcionado');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(header.slice(7));

  if (error || !data.user?.id || !data.user?.email) {
    throw authError('Token inválido o expirado');
  }

  const appUser = await prisma.app_users.findUnique({
    where: { email: data.user.email },
  });

  if (!appUser) {
    throw authError('Usuario no registrado en la plataforma');
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
    throw permissionError('No tienes acceso a este negocio');
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
    throw permissionError(`Permiso denegado: ${role} no puede acceder a ${method} ${path}`);
  }
}

function permissionError(message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = 403;
  throw error;
}

function authError(message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = 401;
  throw error;
}
