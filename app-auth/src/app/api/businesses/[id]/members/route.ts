import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';
import { prisma } from '@global/prisma';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { CreateMemberInput } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id: businessId } = await params;

    await requirePermission(auth, {
      method: 'GET',
      path: '/api/businesses/:id/members',
      businessId,
    });

    const members = await prisma.business_memberships.findMany({
      where: { business_id: businessId, is_active: true },
      include: {
        app_users: true,
        roles: true,
        user_branch_accesses: true,
      },
    });

    return NextResponse.json(
      members.map((m) => ({
        membershipId: m.id,
        userId: m.user_id,
        email: m.app_users.email,
        fullName: m.app_users.full_name,
        role: m.roles.name,
        isOwner: m.is_owner,
        hasFullBranchAccess: m.has_full_branch_access,
        branchIds: m.user_branch_accesses.map((a) => a.branch_id),
        joinedAt: m.created_at,
      }))
    );
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id: businessId } = await params;
    const body = (await req.json()) as CreateMemberInput;

    await requirePermission(auth, {
      method: 'POST',
      path: '/api/businesses/:id/members',
      businessId,
    });

    if (!body.email || !body.fullName) {
      return NextResponse.json(
        { error: 'email y fullName son requeridos' },
        { status: 400 }
      );
    }

    const roleName = body.role ?? 'TRABAJADOR';

    const role = await prisma.roles.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      return NextResponse.json(
        { error: `Rol ${roleName} no encontrado` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: authUser, error: createError } =
      await supabase.auth.admin.createUser({
        email: body.email,
        email_confirm: true,
        user_metadata: { full_name: body.fullName },
      });

    if (createError) {
      return NextResponse.json(
        { error: `Error al crear usuario en Supabase: ${createError.message}` },
        { status: 400 }
      );
    }

    const supabaseUserId = authUser.user?.id;
    if (!supabaseUserId) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
        { status: 500 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.app_users.create({
        data: {
          email: body.email,
          full_name: body.fullName,
          updated_at: new Date(),
        },
      });

      const membership = await tx.business_memberships.create({
        data: {
          user_id: user.id,
          business_id: businessId,
          role_id: role.id,
          is_owner: false,
          has_full_branch_access: false,
          updated_at: new Date(),
        },
      });

      if (body.branchIds?.length) {
        const accesses = body.branchIds.map((branchId) => ({
          user_id: user.id,
          business_id: businessId,
          branch_id: branchId,
          granted_by_user_id: auth.userId,
        }));
        await tx.user_branch_accesses.createMany({ data: accesses });
      }

      return { user, membership };
    });

    return NextResponse.json(
      {
        membershipId: result.membership.id,
        userId: result.user.id,
        email: result.user.email,
        fullName: result.user.full_name,
        role: roleName,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
