import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getWarehouses, createWarehouse } from '@/lib/db-service';
import { warehouseCreateSchema } from '@/lib/validations/warehouse';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { warehouses, total } = await getWarehouses({
      status,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      data: warehouses,
      pagination: { total, limit, offset, has_more: offset + limit < total }
    });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const body = await request.json();

    // Validate input
    const result = warehouseCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const warehouse = await createWarehouse({
      name: result.data.name,
      owner_name: result.data.owner_name,
      email: result.data.email,
      phone: result.data.phone,
      address: result.data.address,
      city: result.data.city,
      country: result.data.country || 'Ethiopia',
      business_type: result.data.business_type,
      bank_name: result.data.bank_name,
      bank_account: result.data.bank_account,
      tax_id: result.data.tax_id,
      status: 'pending_approval',
    });

    return NextResponse.json({ data: warehouse }, { status: 201 });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 500 });
  }
}
