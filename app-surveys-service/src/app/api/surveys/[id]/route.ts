import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateSurveySchema } from '@/lib/validations/survey';

type Params = { params: Promise<{ id: string }> };

// GET /api/surveys/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const survey = await prisma.survey.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: 'asc' } } },
  });

  if (!survey) {
    return NextResponse.json(
      { error: 'Encuesta no encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json(survey);
}

// PATCH /api/surveys/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSurveySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const survey = await prisma.survey.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(survey);
}

// DELETE /api/surveys/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  await prisma.survey.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}