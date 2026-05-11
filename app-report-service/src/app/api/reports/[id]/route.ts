import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@root/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, report.businessId);
    await requireEndpointPermission(role, 'GET', '/api/reports/:id');

    return NextResponse.json(report);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
