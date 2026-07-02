import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const promotion = db.promotions.find(p => p.id === params.id);

  if (!promotion) {
    return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
  }

  return NextResponse.json({ data: promotion });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const promotionIndex = db.promotions.findIndex(p => p.id === params.id);

  if (promotionIndex === -1) {
    return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existing = db.promotions[promotionIndex];

    const updatedPromotion = {
      ...existing,
      title: body.title ?? existing.title,
      image: body.image ?? existing.image,
      target_url: body.target_url ?? existing.target_url,
      location: body.location ?? existing.location,
      target_audience: body.target_audience ?? existing.target_audience,
      status: body.status ?? existing.status,
      start_date: body.start_date ?? existing.start_date,
      end_date: body.end_date ?? existing.end_date,
    };

    db.promotions[promotionIndex] = updatedPromotion;

    return NextResponse.json({ data: updatedPromotion });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const promotionIndex = db.promotions.findIndex(p => p.id === params.id);

  if (promotionIndex === -1) {
    return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
  }

  db.promotions.splice(promotionIndex, 1);

  return NextResponse.json({ success: true });
}
