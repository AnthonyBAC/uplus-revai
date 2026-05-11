import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';
import { prisma } from '@uplus/db';

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
        branches.map((branch: { id: string; name: string; slug: string; is_active: boolean; businesses: { name: string } }) => ({
          id: branch.id,
          name: branch.name,
          slug: branch.slug,
          businessName: branch.businesses.name,
          isActive: branch.is_active,
        }))
      );
    }

    const branches = await prisma.branches.findMany({
      where: { business_id: businessId, is_active: true },
      include: { businesses: { select: { name: true, slug: true } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(
      branches.map((branch: { id: string; name: string; slug: string; is_active: boolean; businesses: { name: string } }) => ({
        id: branch.id,
        name: branch.name,
        slug: branch.slug,
        businessName: branch.businesses.name,
        isActive: branch.is_active,
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
    const body: unknown = await req.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 });
    }

    const businessId = typeof body.businessId === 'string' ? body.businessId : '';
    const name = typeof body.name === 'string' ? body.name : '';
    const slug = typeof body.slug === 'string' ? body.slug : '';

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
        id: crypto.randomUUID(),
        business_id: businessId,
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        updated_at: new Date(),
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
