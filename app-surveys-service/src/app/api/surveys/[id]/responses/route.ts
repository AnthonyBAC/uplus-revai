import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const [{ id }, auth, survey] = await Promise.all([
      params,
      requireAuth(req),
      params.then(({ id: surveyId }) => prisma.survey.findUnique({ where: { id: surveyId } })),
    ]);
    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'GET', '/api/surveys/:id/responses');

    const responses = await prisma.surveyResponse.findMany({
      where: { surveyId: id },
      include: {
        answers: {
          include: { question: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(responses);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
