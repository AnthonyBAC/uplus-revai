import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'app-analysis-service',
        message: 'Example API route',
    });
}
