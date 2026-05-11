import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { CreateQuestionSchema } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@root/lib/auth';

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
    await requireEndpointPermission(role, 'GET', '/api/surveys/:id/questions');

    const questions = await prisma.surveyQuestion.findMany({
      where: { surveyId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(questions);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, survey.businessId);
    await requireEndpointPermission(role, 'POST', '/api/surveys/:id/questions');

    const body = await req.json();
    const parsed = CreateQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const question = await prisma.surveyQuestion.create({
      data: {
        surveyId: id,
        text: parsed.data.text,
        type: parsed.data.type,
        order: parsed.data.order,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
