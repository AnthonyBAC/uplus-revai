import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@root/lib/auth';
import { CreateConnectionSchema } from '@/lib/validations/review';

export async function GET(req: NextRequest) {
  try {
    const businessId = req.nextUrl.searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/connections');

    const connections = await prisma.businessPlatformConnection.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(connections);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateConnectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { businessId } = parsed.data;

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/connections');

    const connection = await prisma.businessPlatformConnection.create({
      data: {
        ...parsed.data,
        tokenExpiresAt: new Date(parsed.data.tokenExpiresAt),
      },
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
