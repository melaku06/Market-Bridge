import { NextRequest, NextResponse } from 'next/server';
import { db, User, Role, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get('role') as Role | null;
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let users = [...db.users];

  // Filter by role
  if (role) {
    users = users.filter(u => u.role === role);
  }

  // Filter by status
  if (status) {
    users = users.filter(u => u.status === status);
  }

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  }

  // Remove password hashes from response
  const safeUsers = users.map(({ password_hash: _, ...user }) => user);

  const total = safeUsers.length;
  const paginatedUsers = safeUsers.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedUsers,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newUser: User = {
      id: generateId('usr'),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      password_hash: '$2b$10$hash', // In real app, hash the password properly
      role: body.role || 'customer',
      status: 'active',
      avatar: body.avatar,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    db.users.push(newUser);

    const { password_hash: _, ...safeUser } = newUser;
    return NextResponse.json({ data: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
