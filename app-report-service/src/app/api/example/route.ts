import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'app-report-service',
        message: 'Example API route',
    });
}
