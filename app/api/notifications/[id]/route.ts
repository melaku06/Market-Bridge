import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getNotificationById, markNotificationRead, deleteNotification } from '@/lib/db-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;
    const notification = await getNotificationById(id);

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ data: notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json({ error: 'Failed to fetch notification' }, { status: 500 });
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

    const notification = await markNotificationRead(id, body.is_read ?? true);

    return NextResponse.json({ data: notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
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
    await deleteNotification(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
