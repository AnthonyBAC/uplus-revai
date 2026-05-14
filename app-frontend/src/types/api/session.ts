export interface MembershipInfo {
  membershipId: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  role: string;
  isOwner: boolean;
  hasFullBranchAccess: boolean;
  branchIds: string[];
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
