import { NextRequest, NextResponse } from 'next/server';
import { updateProduct } from '@/lib/db-service';
import { invalidateProducts, invalidateProduct } from '@/lib/cached-data';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await updateProduct(id, {
      status: 'published',
      updated_at: new Date(),
    });

    invalidateProducts();
    invalidateProduct(id);

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('Error approving product:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to approve product' }, { status: 500 });
  }
}
