import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@uplus/db';
import { CreateSurveySchema } from '@/lib/validations/survey';
import type { CreateSurveyInput } from '@/lib/validations/survey';
import { requireAuth, requireBusinessAccess, requireEndpointPermission } from '@uplus/auth';

export async function GET(req: NextRequest) {
  try {
    const businessId = req.nextUrl.searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
    }

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'GET', '/api/surveys');

    const surveys = await prisma.survey.findMany({
      where: { businessId },
      include: { questions: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(surveys);
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = CreateSurveySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { businessId, branchId, title, questions } = parsed.data;

    const auth = await requireAuth(req);
    const { role } = await requireBusinessAccess(auth.appUserId, businessId);
    await requireEndpointPermission(role, 'POST', '/api/surveys');

    const survey = await prisma.survey.create({
      data: {
        businessId,
        branchId,
        title,
        questions: {
          create: questions.map((question: CreateSurveyInput['questions'][number]) => ({
            text: question.text,
            type: question.type,
            order: question.order,
          })),
        },
      },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
