import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { CreateSurveyResponseSchema } from '@/lib/validations/survey';
import type { CreateSurveyResponseInput } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const [{ id }, auth, body] = await Promise.all([
      params,
      requireAuth(req),
      req.json() as Promise<unknown>,
    ]);

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

    const parsed = CreateSurveyResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { businessId, branchId, answers }: CreateSurveyResponseInput = parsed.data;

    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/surveys/:id/respond');

    const validQuestionIds = new Set<string>(survey.questions.map((q: { id: string }) => q.id));
    const invalidAnswers = answers.filter(
      (answer: CreateSurveyResponseInput['answers'][number]) => !validQuestionIds.has(answer.questionId)
    );

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
          create: answers.map((answer: CreateSurveyResponseInput['answers'][number]) => ({
            questionId: answer.questionId,
            value: answer.value,
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
