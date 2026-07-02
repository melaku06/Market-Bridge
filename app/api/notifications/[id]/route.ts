import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const notification = db.notifications.find(n => n.id === params.id);

  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  return NextResponse.json({ data: notification });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const notificationIndex = db.notifications.findIndex(n => n.id === params.id);

  if (notificationIndex === -1) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existingNotification = db.notifications[notificationIndex];

    const updatedNotification = {
      ...existingNotification,
      read: body.read ?? existingNotification.read,
    };

    db.notifications[notificationIndex] = updatedNotification;

    return NextResponse.json({ data: updatedNotification });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const notificationIndex = db.notifications.findIndex(n => n.id === params.id);

  if (notificationIndex === -1) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  db.notifications.splice(notificationIndex, 1);

  return NextResponse.json({ success: true });
}
