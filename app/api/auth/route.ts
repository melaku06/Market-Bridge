import { NextRequest, NextResponse } from 'next/server';
import { loginUser, getUserById } from '@/lib/auth/db-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await loginUser({ email, password });

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      data: {
        user: result.user,
        token: result.token,
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('jwt-token-', '');

  try {
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
