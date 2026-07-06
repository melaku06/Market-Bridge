import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { updateTelegramGroup, deleteTelegramGroup } from '@/lib/db-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    const updated = await updateTelegramGroup(params.id, {
      group_name: body.group_name,
      group_username: body.group_username,
      member_count: body.member_count,
      is_active: body.is_active,
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating telegram group:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    await deleteTelegramGroup(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting telegram group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}
