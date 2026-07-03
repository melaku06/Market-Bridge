import { NextRequest, NextResponse } from 'next/server';
import { getInventory, createInventory, updateInventory } from '@/lib/db-service';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const warehouse_id = searchParams.get('warehouse_id') || undefined;
    const product_id = searchParams.get('product_id') || undefined;
    const status = searchParams.get('status') || undefined;
    const low_stock = searchParams.get('low_stock') === 'true';

    const inventory = await getInventory({
      warehouse_id,
      product_id,
      status,
      low_stock,
    });

    return NextResponse.json({ data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const quantity = parseInt(body.quantity) || 0;
    const low_stock_threshold = parseInt(body.low_stock_threshold) || 10;

    // Calculate status
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (quantity === 0) status = 'out_of_stock';
    else if (quantity <= low_stock_threshold) status = 'low_stock';

    const inventory = await createInventory({
      warehouse: { connect: { id: body.warehouse_id } },
      product: { connect: { id: body.product_id } },
      quantity,
      reserved_quantity: 0,
      low_stock_threshold,
      status,
    });

    return NextResponse.json({ data: inventory }, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory:', error);
    return NextResponse.json({ error: 'Failed to create inventory' }, { status: 500 });
  }
}
