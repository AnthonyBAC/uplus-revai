import { NextResponse } from 'next/server';
import { prisma } from '@global/prisma';

export async function GET() {
  try {
    const roles = await prisma.roles.findMany({
      where: { can_login: true },
      select: { name: true, description: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(roles);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
