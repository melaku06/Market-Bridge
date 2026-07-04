import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getAddresses, createAddress } from '@/lib/db-service';
import { addressCreateSchema } from '@/lib/validations/common';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const customer_id = searchParams.get('customer_id');

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 });
    }

    const addresses = await getAddresses(customer_id);

    return NextResponse.json({ data: addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();

    // Validate input
    const result = addressCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    const address = await createAddress({
      customer: { connect: { id: body.customer_id } },
      label: data.label,
      recipient_name: data.recipient_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      is_default: data.is_default,
    });

    return NextResponse.json({ data: address }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
