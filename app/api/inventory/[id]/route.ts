import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const inventory = db.inventory.find(i => i.id === params.id);

  if (!inventory) {
    return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  }

  return NextResponse.json({ data: inventory });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const inventoryIndex = db.inventory.findIndex(i => i.id === params.id);

  if (inventoryIndex === -1) {
    return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existing = db.inventory[inventoryIndex];

    const total_stock = body.total_stock !== undefined ? parseInt(body.total_stock) : existing.total_stock;
    const reserved_stock = body.reserved_stock !== undefined ? parseInt(body.reserved_stock) : existing.reserved_stock;
    const available_stock = total_stock - reserved_stock;
    const low_stock_threshold = body.low_stock_threshold !== undefined ? parseInt(body.low_stock_threshold) : existing.low_stock_threshold;

    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (available_stock === 0) status = 'out_of_stock';
    else if (available_stock <= low_stock_threshold) status = 'low_stock';

    const updatedInventory = {
      ...existing,
      total_stock,
      reserved_stock,
      available_stock,
      low_stock_threshold,
      status,
      last_updated: new Date().toISOString(),
    };

    db.inventory[inventoryIndex] = updatedInventory;

    return NextResponse.json({ data: updatedInventory });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const inventoryIndex = db.inventory.findIndex(i => i.id === params.id);

  if (inventoryIndex === -1) {
    return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  }

  db.inventory.splice(inventoryIndex, 1);

  return NextResponse.json({ success: true });
}
