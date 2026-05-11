import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@service/lib/auth';
import { UpdateConnectionSchema } from '@/lib/validations/review';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const connection = await prisma.businessPlatformConnection.findUnique({
      where: { id },
      include: { syncJobs: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });

    if (!connection) {
      return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, connection.businessId);
    await requireEndpointPermission(role, 'GET', '/api/connections/:id');

    return NextResponse.json(connection);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const connection = await prisma.businessPlatformConnection.findUnique({ where: { id } });
    if (!connection) {
      return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, connection.businessId);
    await requireEndpointPermission(role, 'PATCH', '/api/connections/:id');

    const body = await req.json();
    const parsed = UpdateConnectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const data = {
      ...parsed.data,
      ...(parsed.data.tokenExpiresAt
        ? { tokenExpiresAt: new Date(parsed.data.tokenExpiresAt) }
        : {}),
    };

    const updated = await prisma.businessPlatformConnection.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const connection = await prisma.businessPlatformConnection.findUnique({ where: { id } });
    if (!connection) {
      return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, connection.businessId);
    await requireEndpointPermission(role, 'DELETE', '/api/connections/:id');

    await prisma.businessPlatformConnection.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
