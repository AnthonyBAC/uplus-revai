import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateSurveyResponseSchema } from '@/lib/validations/survey';

type Params = { params: Promise<{ id: string }> };

// POST /api/surveys/:id/respond
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const survey = await prisma.survey.findUnique({
    where: { id },
    include: { questions: true },
  });

  if (!survey) {
    return NextResponse.json(
      { error: 'Encuesta no encontrada' },
      { status: 404 }
    );
  }

  if (!survey.isActive) {
    return NextResponse.json(
      { error: 'Esta encuesta no está activa' },
      { status: 409 }
    );
  }

  const body = await req.json();
  const parsed = CreateSurveyResponseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { businessId, branchId, answers } = parsed.data;

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
}