import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getReviews, createReview } from '@/lib/db-service';
import { reviewCreateSchema } from '@/lib/validations/common';
import prisma from '@/lib/prisma';
import { invalidateReviews, invalidateProduct } from '@/lib/cached-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const product_id = searchParams.get('product_id') || undefined;
    const customer_id = searchParams.get('customer_id') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reviews = await getReviews({ product_id, customer_id });

    // Apply pagination
    const paginatedReviews = reviews.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedReviews,
      pagination: {
        total: reviews.length,
        limit,
        offset,
        has_more: offset + limit < reviews.length
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();

    // Validate input
    const result = reviewCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Get product and customer info
    const product = await prisma.product.findUnique({
      where: { id: data.product_id },
    });

    const customer = await prisma.profile.findUnique({
      where: { id: body.customer_id },
    });

    if (!product || !customer) {
      return NextResponse.json({ error: 'Product or customer not found' }, { status: 404 });
    }

    const review = await createReview({
      customer: { connect: { id: customer.id } },
      product: { connect: { id: product.id } },
      customer_name: customer.name,
      product_name: product.name,
      product_image: product.images[0] || null,
      rating: data.rating,
      comment: data.comment,
    });

    // Invalidate caches after review creation
    invalidateReviews();
    invalidateProduct(data.product_id);

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
