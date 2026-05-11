import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@root/lib/auth';
import { ListReportsQuerySchema, CreateReportSchema } from '@/lib/validations/report';

export async function GET(req: NextRequest) {
  try {
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

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/reports');

    const reports = await prisma.report.findMany({
      where: {
        businessId,
        ...(branchId ? { branchId } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { businessId, branchId, title, periodStart, periodEnd } = parsed.data;

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/reports');

    const report = await prisma.report.create({
      data: {
        businessId,
        branchId,
        title,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
