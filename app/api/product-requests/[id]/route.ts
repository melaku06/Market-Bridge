import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const request = db.product_requests.find((r) => r.id === params.id);
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: request });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.product_requests.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  db.product_requests[idx] = { ...db.product_requests[idx], ...body };
  return NextResponse.json({ data: db.product_requests[idx] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.product_requests.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.product_requests.splice(idx, 1);
  return NextResponse.json({ data: { success: true } });
}
