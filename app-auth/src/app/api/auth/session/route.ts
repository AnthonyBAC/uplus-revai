import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@service/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);

    return NextResponse.json({
      userId: auth.userId,
      email: auth.email,
      fullName: auth.fullName,
      memberships: auth.memberships,
    });
  } catch (err: unknown) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return NextResponse.json(
      { error: (err as Error).message },
      { status }
    );
  }
}
