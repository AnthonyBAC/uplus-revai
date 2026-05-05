import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateSyncJobSchema } from '@/lib/validations/review';

// GET /api/sync?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json(
      { error: 'businessId es requerido' },
      { status: 400 }
    );
  }

  const jobs = await prisma.reviewSyncJob.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json(jobs);
}

// POST /api/sync
// Dispara un nuevo sync job para una conexión
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateSyncJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { connectionId, triggeredBy } = parsed.data;

  const connection = await prisma.businessPlatformConnection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    return NextResponse.json(
      { error: 'Conexión no encontrada' },
      { status: 404 }
    );
  }

  const job = await prisma.reviewSyncJob.create({
    data: {
      connectionId,
      businessId: connection.businessId,
      branchId: connection.branchId,
      status: 'PENDING',
      triggeredBy: triggeredBy ?? null,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
