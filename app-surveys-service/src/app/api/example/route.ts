import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'app-surveys-service',
        message: 'Example API route',
    });
}
