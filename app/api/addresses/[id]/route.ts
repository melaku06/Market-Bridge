import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const address = db.addresses.find((a) => a.id === params.id);
  if (!address) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: address });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.addresses.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const updated = { ...db.addresses[idx], ...body };

  if (updated.is_default) {
    db.addresses.forEach((a) => {
      if (a.customer_id === updated.customer_id) a.is_default = false;
    });
  }

  db.addresses[idx] = updated;
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.addresses.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (db.addresses[idx].is_default) {
    return NextResponse.json({ error: 'Cannot delete default address' }, { status: 400 });
  }
  db.addresses.splice(idx, 1);
  return NextResponse.json({ data: { success: true } });
}
