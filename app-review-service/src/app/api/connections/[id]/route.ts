import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateConnectionSchema } from '@/lib/validations/review';

type Params = { params: Promise<{ id: string }> };

// GET /api/connections/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const connection = await prisma.businessPlatformConnection.findUnique({
    where: { id },
    include: { syncJobs: { orderBy: { createdAt: 'desc' }, take: 5 } },
  });

  if (!connection) {
    return NextResponse.json(
      { error: 'Conexión no encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json(connection);
}

// PATCH /api/connections/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateConnectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = {
    ...parsed.data,
    ...(parsed.data.tokenExpiresAt
      ? { tokenExpiresAt: new Date(parsed.data.tokenExpiresAt) }
      : {}),
  };

  const connection = await prisma.businessPlatformConnection.update({
    where: { id },
    data,
  });

  return NextResponse.json(connection);
}

// DELETE /api/connections/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const connection = await prisma.businessPlatformConnection.findUnique({
    where: { id },
  });

  if (!connection) {
    return NextResponse.json(
      { error: 'Conexión no encontrada' },
      { status: 404 }
    );
  }

  await prisma.businessPlatformConnection.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
