import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In real app, verify password hash properly
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // In real app, compare password hash
    // For mock, accept any password
    if (user.status !== 'active') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
    }

    const { password_hash: _, ...safeUser } = user;

    // Return user with a mock token
    return NextResponse.json({
      data: {
        user: safeUser,
        token: `mock-jwt-token-${user.id}`,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  // Mock session check - in real app, validate JWT
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('mock-jwt-token-', '');

  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password_hash: _, ...safeUser } = user;
  return NextResponse.json({ data: safeUser });
}
