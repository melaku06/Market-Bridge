import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const itemIndex = db.wishlist.findIndex(w => w.id === params.id);

  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
  }

  db.wishlist.splice(itemIndex, 1);

  return NextResponse.json({ success: true });
}
