import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@service/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const survey = await prisma.survey.findUnique({ where: { id } });
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
