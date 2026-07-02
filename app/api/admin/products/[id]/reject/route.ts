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

  let body = {};
  try {
    body = await request.json();
  } catch {
    // No body is fine
  }

  // Update product status to rejected
  db.products[productIndex] = {
    ...product,
    status: 'rejected',
    updated_at: new Date().toISOString(),
  };

  // Create audit log
  db.audit_logs.push({
    id: `log-${Date.now()}`,
    actor_id: 'usr-003', // Admin
    actor_name: 'Admin User',
    actor_role: 'admin',
    action: 'PRODUCT_REJECTED',
    entity_type: 'product',
    entity_id: params.id,
    after: body,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ data: db.products[productIndex] });
}
