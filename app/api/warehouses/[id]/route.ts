import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getWarehouseById, updateWarehouse, deleteWarehouse } from '@/lib/db-service';
import { warehouseStatusUpdateSchema } from '@/lib/validations/warehouse';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const { id } = await params;
    const warehouse = await getWarehouseById(id);

    if (!warehouse) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({ data: warehouse });
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json({ error: 'Failed to fetch warehouse' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    // Check if this is a status update
    const isStatusUpdate = body.status && !body.name;

    if (isStatusUpdate) {
      const result = warehouseStatusUpdateSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: result.error.flatten() },
          { status: 400 }
        );
      }
    }

    const warehouse = await updateWarehouse(id, {
      ...body,
      updated_at: new Date(),
    });

    return NextResponse.json({ data: warehouse });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['warehouse', 'admin']);
    if (error) return error;

    const { id } = await params;
    await deleteWarehouse(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 500 });
  }
}
