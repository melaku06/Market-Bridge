import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getAddressById, updateAddress, deleteAddress } from '@/lib/db-service';
import { addressUpdateSchema } from '@/lib/validations/common';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    const address = await getAddressById(id);

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ data: address });
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const result = addressUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const address = await updateAddress(id, result.data);

    return NextResponse.json({ data: address });
  } catch (error) {
    console.error('Error updating address:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    await deleteAddress(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
