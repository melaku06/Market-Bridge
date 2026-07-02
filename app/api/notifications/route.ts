import { NextRequest, NextResponse } from 'next/server';
import { db, Notification, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const user_id = searchParams.get('user_id');
  const type = searchParams.get('type');
  const read = searchParams.get('read');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let notifications = [...db.notifications];

  // Filter by user
  if (user_id) {
    notifications = notifications.filter(n => n.user_id === user_id);
  }

  // Filter by type
  if (type) {
    notifications = notifications.filter(n => n.type === type);
  }

  // Filter by read status
  if (read !== null) {
    const isRead = read === 'true';
    notifications = notifications.filter(n => n.read === isRead);
  }

  // Sort by created_at desc
  notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = notifications.length;
  const paginatedNotifications = notifications.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedNotifications,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newNotification: Notification = {
      id: generateId('notif'),
      user_id: body.user_id,
      title: body.title,
      message: body.message,
      type: body.type || 'system',
      icon: body.icon || 'bell',
      priority: body.priority || 'medium',
      read: false,
      action_url: body.action_url,
      created_at: new Date().toISOString(),
    };

    db.notifications.push(newNotification);

    return NextResponse.json({ data: newNotification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
