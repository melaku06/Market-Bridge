import { NextRequest, NextResponse } from 'next/server';
import { getMarginRuleById, updateMarginRule, deleteMarginRule } from '@/lib/db-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const warehouse_margin = body.warehouse_margin !== undefined ? parseFloat(body.warehouse_margin) : undefined;
    const platform_margin = body.platform_margin !== undefined ? parseFloat(body.platform_margin) : undefined;

    const total_margin = (warehouse_margin !== undefined || platform_margin !== undefined)
      ? (warehouse_margin ?? 0) + (platform_margin ?? 0)
      : undefined;

    const margin = await updateMarginRule(id, {
      warehouse_margin,
      platform_margin,
      total_margin,
      is_active: body.status === 'active' ? true : body.status === 'inactive' ? false : undefined,
    });

    return NextResponse.json({ data: margin });
  } catch (error) {
    console.error('Error updating margin rule:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Margin rule not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update margin rule' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMarginRule(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting margin rule:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Margin rule not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete margin rule' }, { status: 500 });
  }
}
