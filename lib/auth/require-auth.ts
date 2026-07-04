import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { validateTokenUser } from '@/lib/auth/db-service';
import type { AuthUser, UserRole } from '@/lib/auth/types';

export interface AuthResult {
  user: AuthUser | null;
  error: NextResponse | null;
}

export async function requireAuth(
  request: NextRequest,
  allowedRoles?: UserRole[]
): Promise<AuthResult> {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    const response = NextResponse.json(
      { error: 'Session expired. Please log in again.' },
      { status: 401 }
    );
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return { user: null, error: response };
  }

  const user = await validateTokenUser(payload);
  if (!user) {
    const response = NextResponse.json(
      { error: 'Session invalid. Please log in again.' },
      { status: 401 }
    );
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return { user: null, error: response };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}
