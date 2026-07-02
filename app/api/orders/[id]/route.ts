import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = db.orders.find(o => o.id === params.id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderIndex = db.orders.findIndex(o => o.id === params.id);

  if (orderIndex === -1) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existingOrder = db.orders[orderIndex];

    const updatedOrder = {
      ...existingOrder,
      status: body.status ?? existingOrder.status,
      payment_status: body.payment_status ?? existingOrder.payment_status,
      tracking_number: body.tracking_number ?? existingOrder.tracking_number,
      notes: body.notes ?? existingOrder.notes,
      updated_at: new Date().toISOString(),
    };

    db.orders[orderIndex] = updatedOrder;

    return NextResponse.json({ data: updatedOrder });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderIndex = db.orders.findIndex(o => o.id === params.id);

  if (orderIndex === -1) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  db.orders.splice(orderIndex, 1);

  return NextResponse.json({ success: true });
}
