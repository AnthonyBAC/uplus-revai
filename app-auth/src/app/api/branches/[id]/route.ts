import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@service/lib/auth';
import { requirePermission } from '@service/lib/permissions';
import { prisma } from '@root/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;

    const branch = await prisma.branches.findUnique({
      where: { id },
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Sucursal no encontrada' },
        { status: 404 }
      );
    }

    await requirePermission(auth, {
      method: 'GET',
      path: '/api/branches/:id',
      businessId: branch.business_id,
    });

    return NextResponse.json({
      id: branch.id,
      businessId: branch.business_id,
      name: branch.name,
      slug: branch.slug,
      description: branch.description,
      isActive: branch.is_active,
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();

    const branch = await prisma.branches.findUnique({
      where: { id },
    });
    if (!branch) {
      return NextResponse.json(
        { error: 'Sucursal no encontrada' },
        { status: 404 }
      );
    }

    await requirePermission(auth, {
      method: 'PATCH',
      path: '/api/branches/:id',
      businessId: branch.business_id,
    });

    const data: Record<string, unknown> = {};
    if (body.name) data.name = body.name;
    if (body.slug) data.slug = body.slug.toLowerCase().replace(/\s+/g, '-');
    if (typeof body.isActive === 'boolean') data.is_active = body.isActive;
    if (body.description !== undefined) data.description = body.description;

    const updated = await prisma.branches.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      businessId: updated.business_id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      isActive: updated.is_active,
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;

    const branch = await prisma.branches.findUnique({
      where: { id },
    });
    if (!branch) {
      return NextResponse.json(
        { error: 'Sucursal no encontrada' },
        { status: 404 }
      );
    }

    await requirePermission(auth, {
      method: 'DELETE',
      path: '/api/branches/:id',
      businessId: branch.business_id,
    });

    await prisma.branches.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
