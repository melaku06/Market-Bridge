import { NextRequest, NextResponse } from 'next/server';
import { db, Review, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const product_id = searchParams.get('product_id');
  const customer_id = searchParams.get('customer_id');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let reviews = [...db.reviews];

  // Filter by product
  if (product_id) {
    reviews = reviews.filter(r => r.product_id === product_id);
  }

  // Filter by customer
  if (customer_id) {
    reviews = reviews.filter(r => r.customer_id === customer_id);
  }

  // Sort by created_at desc
  reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = reviews.length;
  const paginatedReviews = reviews.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedReviews,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newReview: Review = {
      id: generateId('rev'),
      customer_id: body.customer_id,
      customer_name: body.customer_name,
      product_id: body.product_id,
      product_name: body.product_name,
      product_image: body.product_image,
      rating: parseInt(body.rating) || 5,
      comment: body.comment || '',
      created_at: new Date().toISOString(),
    };

    db.reviews.push(newReview);

    // Update product rating (simplified)
    const product = db.products.find(p => p.id === body.product_id);
    if (product) {
      const productReviews = db.reviews.filter(r => r.product_id === body.product_id);
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      product.rating = Math.round(avgRating * 10) / 10;
      product.review_count = productReviews.length;
    }

    return NextResponse.json({ data: newReview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
