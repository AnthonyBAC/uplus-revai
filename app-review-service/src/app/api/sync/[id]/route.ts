import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@global/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@global/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const job = await prisma.reviewSyncJob.findUnique({
      where: { id },
      include: {
        connection: {
          select: {
            id: true,
            source: true,
            externalLocationId: true,
            status: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job no encontrado' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, job.businessId);
    await requireEndpointPermission(role, 'GET', '/api/sync/:id');

    return NextResponse.json(job);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
