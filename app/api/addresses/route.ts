import { NextRequest, NextResponse } from 'next/server';
import { db, generateId } from '@/lib/mock-db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customer_id = searchParams.get('customer_id');

  let addresses = [...db.addresses];
  if (customer_id) {
    addresses = addresses.filter((a) => a.customer_id === customer_id);
  }

  return NextResponse.json({ data: addresses });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newAddress = {
      id: generateId('addr'),
      customer_id: body.customer_id || 'usr-001',
      label: body.label || 'Home',
      name: body.name,
      phone: body.phone || '',
      address: body.address,
      city: body.city || '',
      country: body.country || 'Ethiopia',
      is_default: body.is_default ?? false,
      created_at: new Date().toISOString(),
    };

    if (newAddress.is_default) {
      db.addresses.forEach((a) => {
        if (a.customer_id === newAddress.customer_id) a.is_default = false;
      });
    }

    db.addresses.push(newAddress);
    return NextResponse.json({ data: newAddress }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
