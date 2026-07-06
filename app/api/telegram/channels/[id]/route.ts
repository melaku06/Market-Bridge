import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramChannelById, updateTelegramChannel, deleteTelegramChannel } from '@/lib/db-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    const updated = await updateTelegramChannel(params.id, {
      channel_name: body.channel_name,
      channel_username: body.channel_username,
      member_count: body.member_count,
      is_active: body.is_active,
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating telegram channel:', error);
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    await deleteTelegramChannel(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting telegram channel:', error);
    return NextResponse.json({ error: 'Failed to delete channel' }, { status: 500 });
  }
}
