import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productIndex = db.products.findIndex(p => p.id === params.id);

  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const product = db.products[productIndex];

  if (product.status !== 'pending') {
    return NextResponse.json({ error: 'Product is not pending approval' }, { status: 400 });
  }

  // Update product status to published
  db.products[productIndex] = {
    ...product,
    status: 'published',
    updated_at: new Date().toISOString(),
  };

  // Create audit log
  db.audit_logs.push({
    id: `log-${Date.now()}`,
    actor_id: 'usr-003', // Admin
    actor_name: 'Admin User',
    actor_role: 'admin',
    action: 'PRODUCT_APPROVED',
    entity_type: 'product',
    entity_id: params.id,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ data: db.products[productIndex] });
}
