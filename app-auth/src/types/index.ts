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

export interface CreateMemberInput {
  email: string;
  fullName: string;
  role?: RoleName;
  branchIds?: string[];
}
