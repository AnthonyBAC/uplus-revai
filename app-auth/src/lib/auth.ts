import { NextRequest } from 'next/server';
import { getSupabaseAnon } from './supabase';
import { prisma } from '@uplus/db';
import type { AuthContext, MembershipInfo } from '@/types';

export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw authError('Token no proporcionado');
  }

  const token = header.slice(7);
  const supabase = getSupabaseAnon();

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.id) {
    throw authError('Token inválido o expirado');
  }

  const email = data.user.email ?? '';

  const appUser = await prisma.app_users.findUnique({
    where: { email },
    include: {
      business_memberships: {
        where: { is_active: true },
        include: {
          roles: true,
          businesses: true,
          user_branch_accesses: true,
        },
      },
    },
  });

  if (!appUser) {
    throw authError('Usuario no encontrado en la plataforma');
  }

  const memberships: MembershipInfo[] = appUser.business_memberships.map((m) => ({
    membershipId: m.id,
    businessId: m.business_id,
    businessName: m.businesses.name,
    businessSlug: m.businesses.slug,
    role: m.roles.name,
    isOwner: m.is_owner,
    hasFullBranchAccess: m.has_full_branch_access,
    branchIds: m.user_branch_accesses.map((a) => a.branch_id),
  }));

  return {
    userId: appUser.id,
    email: appUser.email,
    fullName: appUser.full_name,
    memberships,
  };
}

export function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7);
}

function authError(message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = 401;
  throw error;
}
