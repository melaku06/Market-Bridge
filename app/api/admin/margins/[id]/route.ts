import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const marginIndex = db.margins.findIndex(m => m.id === params.id);

  if (marginIndex === -1) {
    return NextResponse.json({ error: 'Margin rule not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existing = db.margins[marginIndex];

    const warehouse_margin = body.warehouse_margin !== undefined ? parseFloat(body.warehouse_margin) : existing.warehouse_margin;
    const platform_margin = body.platform_margin !== undefined ? parseFloat(body.platform_margin) : existing.platform_margin;

    const updatedMargin = {
      ...existing,
      warehouse_margin,
      platform_margin,
      total_margin: warehouse_margin + platform_margin,
      status: body.status ?? existing.status,
      updated_at: new Date().toISOString(),
    };

    db.margins[marginIndex] = updatedMargin;

    return NextResponse.json({ data: updatedMargin });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const marginIndex = db.margins.findIndex(m => m.id === params.id);

  if (marginIndex === -1) {
    return NextResponse.json({ error: 'Margin rule not found' }, { status: 404 });
  }

  db.margins.splice(marginIndex, 1);

  return NextResponse.json({ success: true });
}
