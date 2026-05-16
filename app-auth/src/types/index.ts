import type { RoleName } from '@uplus/db';

export type { RoleName };

export interface MembershipInfo {
  membershipId: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  role: RoleName;
  isOwner: boolean;
  hasFullBranchAccess: boolean;
  branchIds: string[];
}

export interface AuthContext {
  userId: string;
  email: string;
  fullName: string | null;
  memberships: MembershipInfo[];
}

export interface RegisterInput {
  fullName: string;
  businessName: string;
  businessSlug: string;
}

export interface SignupInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface SessionResponse {
  authenticated: boolean;
  isOnboarded: boolean;
  supabaseUserId: string;
  appUserId: string | null;
  email: string;
  fullName: string | null;
  memberships: MembershipInfo[];
}

export interface AuthResponsePayload {
  user: SessionResponse;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number | null;
    expiresIn: number | null;
    tokenType: string;
  } | null;
  requiresEmailConfirmation: boolean;
}

export interface CreateMemberInput {
  email: string;
  fullName: string;
  role?: RoleName;
  branchIds?: string[];
}
