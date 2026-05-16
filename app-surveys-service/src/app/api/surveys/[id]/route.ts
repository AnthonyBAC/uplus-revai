import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { UpdateSurveySchema } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const [auth, survey] = await Promise.all([
      requireAuth(req),
      params.then(({ id }) =>
        prisma.survey.findUnique({
          where: { id },
          include: { questions: { orderBy: { order: 'asc' } } },
        })
      ),
    ]);

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
    const [auth, body, survey] = await Promise.all([
      requireAuth(req),
      req.json() as Promise<unknown>,
      params.then(({ id }) => prisma.survey.findUnique({ where: { id } })),
    ]);
    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'PATCH', '/api/surveys/:id');

    const parsed = UpdateSurveySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const updated = await prisma.survey.update({
      where: { id: survey.id },
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
    const [auth, survey] = await Promise.all([
      requireAuth(req),
      params.then(({ id }) => prisma.survey.findUnique({ where: { id } })),
    ]);
    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'DELETE', '/api/surveys/:id');

    await prisma.survey.delete({ where: { id: survey.id } });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
