import { NextRequest } from 'next/server';
import { getUserFromToken, requireBusinessAccess, requireEndpointPermission } from '@root/lib/auth';

export async function requireAuth(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw httpError(401, 'Token no proporcionado');
  }
  return getUserFromToken(header.slice(7));
}

function httpError(status: number, message: string): never {
  const error = new Error(message);
  (error as Error & { status: number }).status = status;
  throw error;
}

export { requireBusinessAccess, requireEndpointPermission };
