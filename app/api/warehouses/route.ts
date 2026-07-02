import { NextRequest, NextResponse } from 'next/server';
import { db, Warehouse, WarehouseStatus, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status') as WarehouseStatus | null;
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let warehouses = [...db.warehouses];

  // Filter by status
  if (status) {
    warehouses = warehouses.filter(w => w.status === status);
  }

  // Sort by created_at desc
  warehouses.sort((a, b) => new Date(b.member_since).getTime() - new Date(a.member_since).getTime());

  const total = warehouses.length;
  const paginatedWarehouses = warehouses.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedWarehouses,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newWarehouse: Warehouse = {
      id: generateId('wh'),
      user_id: body.user_id,
      name: body.name,
      owner_name: body.owner_name,
      email: body.email,
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      country: body.country || '',
      business_type: body.business_type || '',
      status: 'pending_approval',
      rating: 0,
      total_products: 0,
      total_orders: 0,
      total_sales: 0,
      performance_score: 0,
      member_since: new Date().toISOString().split('T')[0],
      bank_name: body.bank_name,
      bank_account: body.bank_account,
      tax_id: body.tax_id,
    };

    db.warehouses.push(newWarehouse);

    return NextResponse.json({ data: newWarehouse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
