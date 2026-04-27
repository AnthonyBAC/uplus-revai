import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/surveys/:id/responses
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const survey = await prisma.survey.findUnique({
    where: { id },
  });

  if (!survey) {
    return NextResponse.json(
      { error: 'Encuesta no encontrada' },
      { status: 404 }
    );
  }

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
}