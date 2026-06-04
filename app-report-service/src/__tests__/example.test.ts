import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

import { GET } from '@/app/api/example/route';

describe('GET /api/example', () => {
  it('debe retornar 200 con ok: true', async () => {
    const req = new NextRequest('http://localhost/api/example');
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe('app-report-service');
  });
});