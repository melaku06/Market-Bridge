import { NextRequest, NextResponse } from 'next/server';
import { db, MarginRule, generateId } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json({ data: db.margins });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newMargin: MarginRule = {
      id: generateId('margin'),
      category_id: body.category_id,
      category_name: body.category_name || '',
      product_id: body.product_id,
      warehouse_margin: parseFloat(body.warehouse_margin) || 10,
      platform_margin: parseFloat(body.platform_margin) || 8,
      total_margin: parseFloat(body.warehouse_margin || 10) + parseFloat(body.platform_margin || 8),
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    db.margins.push(newMargin);

    return NextResponse.json({ data: newMargin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
