import { NextResponse } from 'next/server';
import { generateSwaggerDocument } from '@/swagger.config';

export async function GET() {
  return NextResponse.json(generateSwaggerDocument());
}
