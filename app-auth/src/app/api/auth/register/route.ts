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

    const slugBase = body.businessSlug.toLowerCase().replace(/\s+/g, '-');
    let slug = slugBase;
    while (await prisma.businesses.findUnique({ where: { slug } })) {
      const suffix = Math.random().toString(36).substring(2, 6);
      slug = `${slugBase}-${suffix}`;
    }

    const existingUser = await prisma.app_users.findUnique({
      where: { email: auth.email },
    });

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
      const user = existingUser
        ? await tx.app_users.update({
            where: { id: existingUser.id },
            data: { full_name: body.fullName, updated_at: new Date() },
          })
        : await tx.app_users.create({
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

      const [branch, membership] = await Promise.all([
        tx.branches.create({
          data: {
            id: crypto.randomUUID(),
            business_id: business.id,
            name: 'Principal',
            slug: 'principal',
            updated_at: new Date(),
          },
        }),
        tx.business_memberships.create({
          data: {
            id: crypto.randomUUID(),
            user_id: user.id,
            business_id: business.id,
            role_id: role.id,
            is_owner: true,
            has_full_branch_access: true,
            updated_at: new Date(),
          },
        }),
      ]);

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
