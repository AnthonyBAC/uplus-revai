import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';
import { CreateReportSchema, ListReportsQuerySchema } from '@/lib/validations/report';

// GET /api/reports?businessId=xxx&branchId=xxx&status=READY
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = ListReportsQuerySchema.safeParse({
    businessId: searchParams.get('businessId'),
    branchId: searchParams.get('branchId') ?? undefined,
    status: searchParams.get('status') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { businessId, branchId, status } = parsed.data;

  const reports = await prisma.report.findMany({
    where: {
      businessId,
      ...(branchId ? { branchId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reports);
}

// POST /api/reports — requiere Authorization: Bearer <INTERNAL_SERVICE_TOKEN>
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { businessId, branchId, title, periodStart, periodEnd } = parsed.data;

  const report = await prisma.report.create({
    data: {
      businessId,
      ...(branchId ? { branchId } : {}),
      title,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
    },
  });

  return NextResponse.json(report, { status: 201 });
}
