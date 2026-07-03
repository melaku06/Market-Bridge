import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { validateTokenUser } from '@/lib/auth/db-service';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { user: null, isAuthenticated: false },
        { status: 200 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      const response = NextResponse.json(
        { user: null, isAuthenticated: false },
        { status: 200 }
      );
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    const user = await validateTokenUser(payload);

    if (!user) {
      const response = NextResponse.json(
        { user: null, isAuthenticated: false },
        { status: 200 }
      );
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({
      user,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 200 }
    );
  }
}
