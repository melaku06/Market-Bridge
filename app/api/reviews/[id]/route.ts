import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getReviewById, deleteReview } from '@/lib/db-service';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ data: review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const review = await prisma.review.update({
      where: { id },
      data: {
        rating: body.rating,
        comment: body.comment,
      },
    });

    // Update product rating
    const stats = await prisma.review.aggregate({
      where: { product_id: review.product_id },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: review.product_id },
      data: {
        rating: stats._avg.rating || 0,
        review_count: stats._count,
      },
    });

    return NextResponse.json({ data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    await deleteReview(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
