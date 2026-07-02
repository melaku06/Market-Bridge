import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = db.users.find(u => u.id === params.id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password_hash: _, ...safeUser } = user;
  return NextResponse.json({ data: safeUser });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userIndex = db.users.findIndex(u => u.id === params.id);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existingUser = db.users[userIndex];

    const updatedUser = {
      ...existingUser,
      name: body.name ?? existingUser.name,
      email: body.email ?? existingUser.email,
      phone: body.phone ?? existingUser.phone,
      role: body.role ?? existingUser.role,
      status: body.status ?? existingUser.status,
      avatar: body.avatar ?? existingUser.avatar,
    };

    db.users[userIndex] = updatedUser;

    const { password_hash: _, ...safeUser } = updatedUser;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userIndex = db.users.findIndex(u => u.id === params.id);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  db.users.splice(userIndex, 1);

  return NextResponse.json({ success: true });
}
