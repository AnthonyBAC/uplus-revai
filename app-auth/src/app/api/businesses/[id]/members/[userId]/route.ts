import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';
import { prisma } from '@global/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id: businessId, userId } = await params;
    const body = await req.json();

    await requirePermission(auth, {
      method: 'PATCH',
      path: '/api/businesses/:id/members/:userId',
      businessId,
    });

    const membership = await prisma.business_memberships.findUnique({
      where: {
        user_id_business_id: {
          user_id: userId,
          business_id: businessId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};

    if (typeof body.isActive === 'boolean') {
      data.is_active = body.isActive;
    }
    if (typeof body.hasFullBranchAccess === 'boolean') {
      data.has_full_branch_access = body.hasFullBranchAccess;
    }

    if (body.role) {
      const role = await prisma.roles.findUnique({
        where: { name: body.role },
      });
      if (!role) {
        return NextResponse.json(
          { error: `Rol ${body.role} no encontrado` },
          { status: 400 }
        );
      }
      data.role_id = role.id;
    }

    if (body.branchIds && Array.isArray(body.branchIds)) {
      await prisma.user_branch_accesses.deleteMany({
        where: {
          user_id: userId,
          business_id: businessId,
        },
      });

      if (body.branchIds.length > 0) {
        await prisma.user_branch_accesses.createMany({
          data: body.branchIds.map((branchId: string) => ({
            user_id: userId,
            business_id: businessId,
            branch_id: branchId,
            granted_by_user_id: auth.userId,
          })),
        });
      }
    }

    const updated = await prisma.business_memberships.update({
      where: { id: membership.id },
      data,
      include: {
        roles: true,
        user_branch_accesses: true,
      },
    });

    return NextResponse.json({
      membershipId: updated.id,
      userId: updated.user_id,
      role: updated.roles.name,
      isActive: updated.is_active,
      hasFullBranchAccess: updated.has_full_branch_access,
      branchIds: updated.user_branch_accesses.map((a) => a.branch_id),
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id: businessId, userId } = await params;

    await requirePermission(auth, {
      method: 'DELETE',
      path: '/api/businesses/:id/members/:userId',
      businessId,
    });

    await prisma.user_branch_accesses.deleteMany({
      where: {
        user_id: userId,
        business_id: businessId,
      },
    });

    await prisma.business_memberships.delete({
      where: {
        user_id_business_id: {
          user_id: userId,
          business_id: businessId,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
