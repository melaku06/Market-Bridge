import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const review = db.reviews.find(r => r.id === params.id);

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  return NextResponse.json({ data: review });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reviewIndex = db.reviews.findIndex(r => r.id === params.id);

  if (reviewIndex === -1) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existingReview = db.reviews[reviewIndex];

    const updatedReview = {
      ...existingReview,
      rating: body.rating ?? existingReview.rating,
      comment: body.comment ?? existingReview.comment,
    };

    db.reviews[reviewIndex] = updatedReview;

    return NextResponse.json({ data: updatedReview });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reviewIndex = db.reviews.findIndex(r => r.id === params.id);

  if (reviewIndex === -1) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  db.reviews.splice(reviewIndex, 1);

  return NextResponse.json({ success: true });
}
