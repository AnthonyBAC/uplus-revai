import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { CreateSurveyResponseSchema } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@service/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAuth(req);

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    if (!survey.isActive) {
      return NextResponse.json({ error: 'Esta encuesta no está activa' }, { status: 409 });
    }

    const body = await req.json();
    const parsed = CreateSurveyResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { businessId, branchId, answers } = parsed.data;

    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/surveys/:id/respond');

    const validQuestionIds = new Set(survey.questions.map((q) => q.id));
    const invalidAnswers = answers.filter((a) => !validQuestionIds.has(a.questionId));

    if (invalidAnswers.length > 0) {
      return NextResponse.json(
        { error: 'Algunas respuestas referencian preguntas que no pertenecen a esta encuesta' },
        { status: 422 }
      );
    }

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: id,
        businessId,
        branchId,
        capturedByUserId: auth.appUserId,
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            value: a.value,
          })),
        },
      },
      include: { answers: true },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
