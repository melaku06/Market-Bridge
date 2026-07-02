import { NextRequest, NextResponse } from 'next/server';
import { db, Order, OrderStatus, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status') as OrderStatus | null;
  const customer_id = searchParams.get('customer_id');
  const warehouse_id = searchParams.get('warehouse_id');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let orders = [...db.orders];

  // Filter by customer
  if (customer_id) {
    orders = orders.filter(o => o.customer_id === customer_id);
  }

  // Filter by warehouse
  if (warehouse_id) {
    orders = orders.filter(o => o.warehouse_id === warehouse_id);
  }

  // Filter by status
  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  // Sort by created_at desc
  orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = orders.length;
  const paginatedOrders = orders.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedOrders,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderNumber = `MB${Math.floor(Math.random() * 9000) + 1000}`;

    const newOrder: Order = {
      id: orderNumber,
      customer_id: body.customer_id,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      warehouse_id: body.warehouse_id,
      items: body.items,
      subtotal: parseFloat(body.subtotal) || 0,
      shipping_fee: parseFloat(body.shipping_fee) || 0,
      discount: parseFloat(body.discount) || 0,
      tax: parseFloat(body.tax) || 0,
      total: parseFloat(body.total) || 0,
      status: 'pending',
      payment_method: body.payment_method,
      payment_status: 'pending',
      shipping_address: body.shipping_address,
      shipping_city: body.shipping_city,
      shipping_method: body.shipping_method,
      notes: body.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.orders.push(newOrder);

    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
