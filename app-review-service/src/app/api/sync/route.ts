import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';
import { CreateSyncJobSchema } from '@/lib/validations/review';

export async function GET(req: NextRequest) {
  try {
    const businessId = req.nextUrl.searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/sync');

    const jobs = await prisma.reviewSyncJob.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(jobs);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = CreateSyncJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { connectionId, triggeredBy } = parsed.data;

    const connection = await prisma.businessPlatformConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
    }

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, connection.businessId);
    await requireEndpointPermission(role, 'POST', '/api/sync');

    const job = await prisma.reviewSyncJob.create({
      data: {
        connectionId,
        businessId: connection.businessId,
        branchId: connection.branchId,
        status: 'PENDING',
        triggeredBy: triggeredBy ?? auth.appUserId,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
