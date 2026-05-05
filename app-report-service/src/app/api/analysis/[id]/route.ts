import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/analysis/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const result = await prisma.analysisResult.findUnique({ where: { id } });

  if (!result) {
    return NextResponse.json({ error: 'Resultado de análisis no encontrado' }, { status: 404 });
  }

  return NextResponse.json(result);
}
