import { NextRequest, NextResponse } from 'next/server';
import { db, Promotion, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');

  let promotions = [...db.promotions];

  if (status) {
    promotions = promotions.filter(p => p.status === status);
  }

  return NextResponse.json({ data: promotions });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPromotion: Promotion = {
      id: generateId('promo'),
      title: body.title,
      type: body.type || 'banner',
      image: body.image,
      target_url: body.target_url,
      location: body.location,
      target_audience: body.target_audience || 'All Users',
      status: 'inactive',
      start_date: body.start_date,
      end_date: body.end_date,
      impressions: 0,
      clicks: 0,
      created_at: new Date().toISOString(),
    };

    db.promotions.push(newPromotion);

    return NextResponse.json({ data: newPromotion }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
