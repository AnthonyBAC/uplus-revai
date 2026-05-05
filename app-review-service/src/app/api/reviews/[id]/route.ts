import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/reviews/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    return NextResponse.json(
      { error: 'Reseña no encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json(review);
}

// DELETE /api/reviews/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    return NextResponse.json(
      { error: 'Reseña no encontrada' },
      { status: 404 }
    );
  }

  await prisma.review.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
