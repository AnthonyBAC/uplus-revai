import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateSurveySchema } from '@/lib/validations/survey';

// GET /api/surveys?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json(
      { error: 'businessId es requerido' },
      { status: 400 }
    );
  }

  const surveys = await prisma.survey.findMany({
    where: { businessId },
    include: { questions: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(surveys);
}

// POST /api/surveys
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateSurveySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { businessId, branchId, title, questions } = parsed.data;

  const survey = await prisma.survey.create({
    data: {
      businessId,
      branchId,
      title,
      questions: {
        create: questions.map((q) => ({
          text: q.text,
          type: q.type,
          order: q.order,
        })),
      },
    },
    include: { questions: { orderBy: { order: 'asc' } } },
  });

  return NextResponse.json(survey, { status: 201 });
}