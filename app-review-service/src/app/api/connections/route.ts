import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateConnectionSchema } from '@/lib/validations/review';

// GET /api/connections?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json(
      { error: 'businessId es requerido' },
      { status: 400 }
    );
  }

  const connections = await prisma.businessPlatformConnection.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(connections);
}

// POST /api/connections
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateConnectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const connection = await prisma.businessPlatformConnection.create({
    data: {
      ...parsed.data,
      tokenExpiresAt: new Date(parsed.data.tokenExpiresAt),
    },
  });

  return NextResponse.json(connection, { status: 201 });
}
