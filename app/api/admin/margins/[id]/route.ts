import { NextRequest, NextResponse } from 'next/server';
import { updateMarginRule, deleteMarginRule } from '@/lib/db-service';
import { requireAuth } from '@/lib/auth/require-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const marginRule = await updateMarginRule(id, body);

    return NextResponse.json({ data: marginRule });
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
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

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
