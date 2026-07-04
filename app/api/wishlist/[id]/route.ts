import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { removeFromWishlist } from '@/lib/db-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    await removeFromWishlist(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
