import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getNotifications, createNotification, getUnreadCount } from '@/lib/db-service';
import { notificationCreateSchema } from '@/lib/validations/common';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const user_id = searchParams.get('user_id');
    const type = searchParams.get('type') || undefined;
    const is_read = searchParams.get('is_read') ? searchParams.get('is_read') === 'true' : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const [notifications, unreadCount] = await Promise.all([
      getNotifications({
        user_id,
        type,
        is_read,
        limit,
      }),
      getUnreadCount(user_id),
    ]);

    return NextResponse.json({
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();

    // Validate input
    const result = notificationCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const notification = await createNotification({
      user: { connect: { id: result.data.user_id } },
      type: result.data.type,
      priority: result.data.priority,
      title: result.data.title,
      message: result.data.message,
      data: result.data.data,
      action_url: result.data.action_url,
      is_read: false,
    });

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
