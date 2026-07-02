import { NextRequest, NextResponse } from 'next/server';
import { db, Inventory, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const warehouse_id = searchParams.get('warehouse_id');
  const product_id = searchParams.get('product_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let inventory = [...db.inventory];

  // Filter by warehouse
  if (warehouse_id) {
    inventory = inventory.filter(i => i.warehouse_id === warehouse_id);
  }

  // Filter by product
  if (product_id) {
    inventory = inventory.filter(i => i.product_id === product_id);
  }

  // Filter by status
  if (status) {
    inventory = inventory.filter(i => i.status === status);
  }

  const total = inventory.length;
  const paginatedInventory = inventory.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedInventory,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const total_stock = parseInt(body.total_stock) || 0;
    const reserved_stock = parseInt(body.reserved_stock) || 0;
    const available_stock = total_stock - reserved_stock;
    const low_stock_threshold = parseInt(body.low_stock_threshold) || 10;

    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (available_stock === 0) status = 'out_of_stock';
    else if (available_stock <= low_stock_threshold) status = 'low_stock';

    const newInventory: Inventory = {
      id: generateId('inv'),
      product_id: body.product_id,
      product_name: body.product_name || '',
      warehouse_id: body.warehouse_id,
      sku: body.sku || '',
      total_stock,
      reserved_stock,
      available_stock,
      low_stock_threshold,
      status,
      last_updated: new Date().toISOString(),
    };

    db.inventory.push(newInventory);

    return NextResponse.json({ data: newInventory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
