import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/db-service';
import { createAuditLog } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await loginUser({ email, password });

    if (!result.success) {
      await createAuditLog({
        actor_id: 'unknown',
        actor_name: email,
        actor_role: 'unknown',
        action: 'LOGIN_FAILED',
        entity_type: 'auth',
        entity_id: email,
        description: `Failed login attempt for ${email}`,
      });
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    await createAuditLog({
      actor_id: result.user!.id,
      actor_name: result.user!.name,
      actor_role: result.user!.role,
      action: 'LOGIN',
      entity_type: 'auth',
      entity_id: result.user!.id,
      description: `${result.user!.name} logged in`,
    });

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set('auth_token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
