import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db-service';
import { requireAuth } from '@/lib/auth/require-auth';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { products } = await getProducts({ status: 'pending' });

    const enrichedProducts = products.map(product => ({
      ...product,
      warehouse_name: product.warehouse?.name || 'Unknown',
      warehouse_owner: product.warehouse?.owner_name || 'Unknown',
    }));

    return NextResponse.json({ data: enrichedProducts });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json({ error: 'Failed to fetch pending products' }, { status: 500 });
  }
}
