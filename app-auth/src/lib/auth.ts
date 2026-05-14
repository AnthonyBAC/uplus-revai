import { NextRequest } from 'next/server';
import { getSupabaseAnon } from './supabase';
import { prisma } from '@uplus/db';
import type { AuthContext, MembershipInfo, SessionResponse } from '@/types';
import type { User } from '@supabase/supabase-js';

export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw authError('Token no proporcionado');
  }

  const token = header.slice(7);
  const supabaseUser = await getSupabaseUserFromToken(token);
  const appUser = await getPlatformUserByEmail(supabaseUser.email ?? '');

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

export async function getSupabaseUserFromToken(token: string): Promise<User> {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.id || !data.user.email) {
    throw authError('Token inválido o expirado');
  }

  return data.user;
}

export async function getPlatformUserByEmail(email: string) {
  if (!email) return null;

  return prisma.app_users.findUnique({
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
}

export async function resolveSessionResponseFromToken(token: string): Promise<SessionResponse> {
  const supabaseUser = await getSupabaseUserFromToken(token);
  const appUser = await getPlatformUserByEmail(supabaseUser.email ?? '');

  const memberships: MembershipInfo[] =
    appUser?.business_memberships.map((membership) => ({
      membershipId: membership.id,
      businessId: membership.business_id,
      businessName: membership.businesses.name,
      businessSlug: membership.businesses.slug,
      role: membership.roles.name,
      isOwner: membership.is_owner,
      hasFullBranchAccess: membership.has_full_branch_access,
      branchIds: membership.user_branch_accesses.map((access) => access.branch_id),
    })) ?? [];

  const metadata = supabaseUser.user_metadata;
  const metadataName = typeof metadata?.full_name === 'string' ? metadata.full_name : null;

  return {
    authenticated: true,
    isOnboarded: memberships.length > 0,
    supabaseUserId: supabaseUser.id,
    appUserId: appUser?.id ?? null,
    email: supabaseUser.email ?? '',
    fullName: appUser?.full_name ?? metadataName,
    memberships,
  };
}

function authError(message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = 401;
  throw error;
}
