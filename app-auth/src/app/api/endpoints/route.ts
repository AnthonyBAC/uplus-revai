import { NextResponse } from 'next/server';
import { prisma } from '@uplus/db';

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
      endpoints.map((endpoint: {
        id: string;
        key: string;
        method: string;
        path: string;
        description: string | null;
        role_endpoint_permissions: Array<{ allowed: boolean; roles: { name: string } }>;
      }) => ({
        id: endpoint.id,
        key: endpoint.key,
        method: endpoint.method,
        path: endpoint.path,
        description: endpoint.description,
        allowedRoles: endpoint.role_endpoint_permissions
          .filter((permission: { allowed: boolean }) => permission.allowed)
          .map((permission: { roles: { name: string } }) => permission.roles.name),
      }))
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
