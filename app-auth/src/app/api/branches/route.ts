import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';
import { prisma } from '@global/prisma';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const { searchParams } = req.nextUrl;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId es requerido' },
        { status: 400 }
      );
    }

    const { role } = await requirePermission(auth, {
      method: 'GET',
      path: '/api/branches',
      businessId,
    });

    const membership = auth.memberships.find(
      (m) => m.businessId === businessId
    );

    if (role === 'TRABAJADOR' && membership) {
      const branches = await prisma.branches.findMany({
        where: {
          business_id: businessId,
          is_active: true,
          ...(membership.hasFullBranchAccess
            ? {}
            : {
                user_branch_accesses: {
                  some: { user_id: auth.userId },
                },
              }),
        },
        include: { businesses: { select: { name: true, slug: true } } },
        orderBy: { name: 'asc' },
      });

      return NextResponse.json(
        branches.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          businessName: b.businesses.name,
          isActive: b.is_active,
        }))
      );
    }

    const branches = await prisma.branches.findMany({
      where: { business_id: businessId, is_active: true },
      include: { businesses: { select: { name: true, slug: true } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(
      branches.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        businessName: b.businesses.name,
        isActive: b.is_active,
      }))
    );
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const body = await req.json();
    const { businessId, name, slug } = body;

    if (!businessId || !name || !slug) {
      return NextResponse.json(
        { error: 'businessId, name y slug son requeridos' },
        { status: 400 }
      );
    }

    await requirePermission(auth, {
      method: 'POST',
      path: '/api/branches',
      businessId,
    });

    const branch = await prisma.branches.create({
      data: {
        business_id: businessId,
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
      },
      include: { businesses: { select: { name: true } } },
    });

    return NextResponse.json(
      {
        id: branch.id,
        name: branch.name,
        slug: branch.slug,
        businessName: branch.businesses.name,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
