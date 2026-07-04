import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getInventoryItem, updateInventory } from '@/lib/db-service';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const { id } = await params;
    const inventory = await getInventoryItem(id);

    if (!inventory) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    return NextResponse.json({ data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const quantity = body.quantity !== undefined ? parseInt(body.quantity) : undefined;
    const reservedQuantity = body.reserved_quantity !== undefined ? parseInt(body.reserved_quantity) : undefined;
    const lowStockThreshold = body.low_stock_threshold !== undefined ? parseInt(body.low_stock_threshold) : undefined;

    // Calculate status based on available stock
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' | undefined;
    if (quantity !== undefined) {
      const existing = await prisma.inventory.findUnique({ where: { id } });
      const reserved = reservedQuantity ?? existing?.reserved_quantity ?? 0;
      const threshold = lowStockThreshold ?? existing?.low_stock_threshold ?? 10;
      const available = quantity - reserved;

      if (available <= 0) status = 'out_of_stock';
      else if (available <= threshold) status = 'low_stock';
      else status = 'in_stock';
    }

    const inventory = await updateInventory(id, {
      quantity,
      reserved_quantity: reservedQuantity,
      low_stock_threshold: lowStockThreshold,
      status,
    });

    return NextResponse.json({ data: inventory });
  } catch (error) {
    console.error('Error updating inventory:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const { id } = await params;
    await prisma.inventory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete inventory' }, { status: 500 });
  }
}
