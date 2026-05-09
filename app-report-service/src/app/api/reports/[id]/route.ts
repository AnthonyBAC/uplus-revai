import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';
import { UpdateReportSchema } from '@/lib/validations/report';

type Params = { params: Promise<{ id: string }> };

// GET /api/reports/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const report = await prisma.report.findUnique({ where: { id } });

  if (!report) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  return NextResponse.json(report);
}

// PATCH /api/reports/:id — requiere Authorization: Bearer <INTERNAL_SERVICE_TOKEN>
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  const updated = await prisma.report.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(parsed.data.generatedAt ? { generatedAt: new Date(parsed.data.generatedAt) } : {}),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/reports/:id — requiere Authorization: Bearer <INTERNAL_SERVICE_TOKEN>
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  await prisma.report.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
