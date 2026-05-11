import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@root/lib/prisma';
import { UpdateQuestionSchema } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@service/lib/auth';

type Params = { params: Promise<{ id: string; questionId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id, questionId } = await params;
    const auth = await requireAuth(req);

    const question = await prisma.surveyQuestion.findUnique({
      where: { id: questionId },
      include: { survey: true },
    });

    if (!question || question.surveyId !== id) {
      return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, question.survey.businessId);
    await requireEndpointPermission(role, 'PATCH', '/api/surveys/:id/questions/:questionId');

    const body = await req.json();
    const parsed = UpdateQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const updated = await prisma.surveyQuestion.update({
      where: { id: questionId },
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
    const { id, questionId } = await params;
    const auth = await requireAuth(req);

    const question = await prisma.surveyQuestion.findUnique({
      where: { id: questionId },
      include: { survey: true },
    });

    if (!question || question.surveyId !== id) {
      return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 });
    }

    const { role } = await requireBusinessAccess(auth.appUserId, question.survey.businessId);
    await requireEndpointPermission(role, 'DELETE', '/api/surveys/:id/questions/:questionId');

    await prisma.surveyQuestion.delete({ where: { id: questionId } });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
