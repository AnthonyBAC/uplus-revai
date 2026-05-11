import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { requireAuth } from '@/lib/auth';
import type { RegisterInput } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const body = (await req.json()) as RegisterInput;

    if (!body.fullName || !body.businessName || !body.businessSlug) {
      return NextResponse.json(
        { error: 'fullName, businessName y businessSlug son requeridos' },
        { status: 400 }
      );
    }

    const slug = body.businessSlug.toLowerCase().replace(/\s+/g, '-');

    const existingBusiness = await prisma.businesses.findUnique({
      where: { slug },
    });
    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Ya existe un negocio con ese slug' },
        { status: 409 }
      );
    }

    const existingUser = await prisma.app_users.findUnique({
      where: { email: auth.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya está registrado' },
        { status: 409 }
      );
    }

    const role = await prisma.roles.findUnique({
      where: { name: 'ADMIN' },
    });

    if (!role) {
      return NextResponse.json(
        { error: 'Rol ADMIN no encontrado. Ejecuta el seed primero.' },
        { status: 500 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.app_users.create({
        data: {
          id: crypto.randomUUID(),
          email: auth.email,
          full_name: body.fullName,
          updated_at: new Date(),
        },
      });

      const business = await tx.businesses.create({
        data: {
          id: crypto.randomUUID(),
          name: body.businessName,
          slug,
          updated_at: new Date(),
        },
      });

      const branch = await tx.branches.create({
        data: {
          id: crypto.randomUUID(),
          business_id: business.id,
          name: 'Principal',
          slug: 'principal',
          updated_at: new Date(),
        },
      });

      const membership = await tx.business_memberships.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          business_id: business.id,
          role_id: role.id,
          is_owner: true,
          has_full_branch_access: true,
          updated_at: new Date(),
        },
      });

      await tx.user_branch_accesses.create({
        data: {
          user_id: user.id,
          business_id: business.id,
          branch_id: branch.id,
          granted_by_user_id: user.id,
        },
      });

      return { user, business, branch, membership };
    });

    return NextResponse.json(
      {
        userId: result.user.id,
        businessId: result.business.id,
        businessSlug: result.business.slug,
        branchId: result.branch.id,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}
