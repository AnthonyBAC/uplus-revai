import { NextRequest } from 'next/server';

export function isAuthorized(req: NextRequest): boolean {
  const token = process.env.INTERNAL_SERVICE_TOKEN;
  const header = req.headers.get('authorization') ?? '';
  if (!token) return false;
  return header === `Bearer ${token}`;
}
