import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@global/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@global/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, review.businessId);
    await requireEndpointPermission(role, 'GET', '/api/reviews/:id');

    return NextResponse.json(review);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, review.businessId);
    await requireEndpointPermission(role, 'DELETE', '/api/reviews/:id');

    await prisma.review.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
