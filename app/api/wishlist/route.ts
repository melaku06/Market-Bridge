import { NextRequest, NextResponse } from 'next/server';
import { db, WishlistItem, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const customer_id = searchParams.get('customer_id');

  if (!customer_id) {
    return NextResponse.json({ error: 'customer_id is required' }, { status: 400 });
  }

  const wishlistItems = db.wishlist.filter(w => w.customer_id === customer_id);

  // Enrich with product data
  const enrichedItems = wishlistItems.map(item => {
    const product = db.products.find(p => p.id === item.product_id);
    return {
      ...item,
      product: product || null,
    };
  });

  return NextResponse.json({ data: enrichedItems });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if already in wishlist
    const existing = db.wishlist.find(
      w => w.customer_id === body.customer_id && w.product_id === body.product_id
    );

    if (existing) {
      return NextResponse.json({ data: existing });
    }

    const newItem: WishlistItem = {
      id: generateId('wish'),
      customer_id: body.customer_id,
      product_id: body.product_id,
      created_at: new Date().toISOString(),
    };

    db.wishlist.push(newItem);

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const customer_id = searchParams.get('customer_id');
  const product_id = searchParams.get('product_id');

  if (!customer_id || !product_id) {
    return NextResponse.json({ error: 'customer_id and product_id are required' }, { status: 400 });
  }

  const itemIndex = db.wishlist.findIndex(
    w => w.customer_id === customer_id && w.product_id === product_id
  );

  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 });
  }

  db.wishlist.splice(itemIndex, 1);

  return NextResponse.json({ success: true });
}
