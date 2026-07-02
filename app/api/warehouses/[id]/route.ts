import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const warehouse = db.warehouses.find(w => w.id === params.id);

  if (!warehouse) {
    return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
  }

  return NextResponse.json({ data: warehouse });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const warehouseIndex = db.warehouses.findIndex(w => w.id === params.id);

  if (warehouseIndex === -1) {
    return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existingWarehouse = db.warehouses[warehouseIndex];

    const updatedWarehouse = {
      ...existingWarehouse,
      name: body.name ?? existingWarehouse.name,
      owner_name: body.owner_name ?? existingWarehouse.owner_name,
      email: body.email ?? existingWarehouse.email,
      phone: body.phone ?? existingWarehouse.phone,
      address: body.address ?? existingWarehouse.address,
      city: body.city ?? existingWarehouse.city,
      country: body.country ?? existingWarehouse.country,
      business_type: body.business_type ?? existingWarehouse.business_type,
      status: body.status ?? existingWarehouse.status,
      bank_name: body.bank_name ?? existingWarehouse.bank_name,
      bank_account: body.bank_account ?? existingWarehouse.bank_account,
      tax_id: body.tax_id ?? existingWarehouse.tax_id,
    };

    db.warehouses[warehouseIndex] = updatedWarehouse;

    return NextResponse.json({ data: updatedWarehouse });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const warehouseIndex = db.warehouses.findIndex(w => w.id === params.id);

  if (warehouseIndex === -1) {
    return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
  }

  db.warehouses.splice(warehouseIndex, 1);

  return NextResponse.json({ success: true });
}
