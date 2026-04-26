import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'app-review-service',
        message: 'Example API route',
    });
}
