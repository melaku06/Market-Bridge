import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/db-service';
import { wishlistAddSchema } from '@/lib/validations/common';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const customer_id = searchParams.get('customer_id');

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 });
    }

    const wishlistItems = await getWishlist(customer_id);

    return NextResponse.json({ data: wishlistItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();

    // Validate input
    const result = wishlistAddSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await isInWishlist(body.customer_id, result.data.product_id);
    if (existing) {
      const items = await getWishlist(body.customer_id);
      const existingItem = items.find(i => i.product_id === result.data.product_id);
      return NextResponse.json({ data: existingItem });
    }

    const wishlistItem = await addToWishlist({
      customer: { connect: { id: body.customer_id } },
      product: { connect: { id: result.data.product_id } },
    });

    return NextResponse.json({ data: wishlistItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const customer_id = searchParams.get('customer_id');
    const product_id = searchParams.get('product_id');

    if (id) {
      await removeFromWishlist(id);
    } else if (customer_id && product_id) {
      // Find and delete by customer_id and product_id
      const item = await prisma.wishlistItem.findFirst({
        where: { customer_id, product_id },
      });
      if (item) {
        await removeFromWishlist(item.id);
      }
    } else {
      return NextResponse.json({ error: 'id or (customer_id and product_id) required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
