import { NextResponse } from 'next/server';
import { prisma } from '@global/prisma';

export async function GET() {
  try {
    const endpoints = await prisma.endpoints.findMany({
      where: { is_active: true },
      include: {
        role_endpoint_permissions: {
          include: {
            roles: { select: { name: true } },
          },
        },
      },
      orderBy: [{ method: 'asc' }, { path: 'asc' }],
    });

    return NextResponse.json(
      endpoints.map((e) => ({
        id: e.id,
        key: e.key,
        method: e.method,
        path: e.path,
        description: e.description,
        allowedRoles: e.role_endpoint_permissions
          .filter((p) => p.allowed)
          .map((p) => p.roles.name),
      }))
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
