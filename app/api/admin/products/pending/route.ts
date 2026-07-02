import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET() {
  const pendingProducts = db.products.filter(p => p.status === 'pending');

  // Enrich with warehouse data
  const enrichedProducts = pendingProducts.map(product => {
    const warehouse = db.warehouses.find(w => w.id === product.warehouse_id);
    return {
      ...product,
      warehouse_name: warehouse?.name || 'Unknown',
      warehouse_owner: warehouse?.owner_name || 'Unknown',
    };
  });

  return NextResponse.json({ data: enrichedProducts });
}
