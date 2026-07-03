import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json({ data: db.system_settings });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    db.system_settings = { ...db.system_settings, ...body };
    return NextResponse.json({ data: db.system_settings });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
