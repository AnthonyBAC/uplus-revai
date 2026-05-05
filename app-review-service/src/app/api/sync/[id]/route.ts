import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/sync/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

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
    return NextResponse.json(
      { error: 'Job no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}
