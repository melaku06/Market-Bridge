import { NextRequest, NextResponse } from 'next/server';
import { getPromotions, createPromotion } from '@/lib/db-service';
import { promotionCreateSchema } from '@/lib/validations/common';
import { requireAuth } from '@/lib/auth/require-auth';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    const promotions = await getPromotions({ status, type });

    return NextResponse.json({ data: promotions });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;
    const body = await request.json();

    // Validate input
    const result = promotionCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const promotion = await createPromotion({
      title: result.data.title,
      type: result.data.type,
      image_url: result.data.image_url,
      target_url: result.data.target_url,
      location: result.data.location,
      target_audience: result.data.target_audience,
      status: result.data.status,
      start_date: result.data.start_date,
      end_date: result.data.end_date,
    });

    return NextResponse.json({ data: promotion }, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}
