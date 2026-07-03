import { NextRequest, NextResponse } from 'next/server';
import { updateProduct } from '@/lib/db-service';
import { createAuditLog } from '@/lib/db-service';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check product exists and is pending
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.status !== 'pending') {
      return NextResponse.json({ error: 'Product is not pending approval' }, { status: 400 });
    }

    let body: { reason?: string } = {};
    try {
      body = await request.json();
    } catch {
      // No body is fine
    }

    // Update product status to rejected
    const updatedProduct = await updateProduct(id, { status: 'rejected' });

    // Create audit log
    await createAuditLog({
      actor_id: 'admin',
      actor_name: 'Admin User',
      actor_role: 'admin',
      action: 'PRODUCT_REJECTED',
      entity_type: 'product',
      entity_id: id,
      before_state: JSON.stringify({ status: 'pending' }),
      after_state: JSON.stringify({ status: 'rejected', reason: body.reason }),
    });

    return NextResponse.json({ data: updatedProduct });
  } catch (error) {
    console.error('Error rejecting product:', error);
    return NextResponse.json({ error: 'Failed to reject product' }, { status: 500 });
  }
}
