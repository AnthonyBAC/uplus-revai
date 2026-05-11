import { prisma } from '@uplus/db';
import type { AuthContext, RoleName } from '@/types';

export interface PermissionCheck {
  method: string;
  path: string;
  businessId: string;
}

export async function requirePermission(
  auth: AuthContext,
  options: PermissionCheck
): Promise<{ role: RoleName; membershipId: string }> {
  const { method, path, businessId } = options;

  const membership = auth.memberships.find((m) => m.businessId === businessId);
  if (!membership) {
    throw permissionError('No tienes acceso a este negocio');
  }

  const allowed = await prisma.role_endpoint_permissions.findFirst({
    where: {
      allowed: true,
      endpoints: {
        method: method as never,
        path,
        is_active: true,
      },
      roles: {
        name: membership.role,
        can_login: true,
      },
    },
  });

  if (!allowed) {
    throw permissionError(
      `Permiso denegado: ${membership.role} no puede acceder a ${method} ${path}`
    );
  }

  return { role: membership.role, membershipId: membership.membershipId };
}

function permissionError(message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = 403;
  throw error;
}
