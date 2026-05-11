import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { UpdateSurveySchema } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@root/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'GET', '/api/surveys/:id');

    return NextResponse.json(survey);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'PATCH', '/api/surveys/:id');

    const body = await req.json();
    const parsed = UpdateSurveySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const updated = await prisma.survey.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'DELETE', '/api/surveys/:id');

    await prisma.survey.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
