import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const PUBLIC_EXACT = new Set(['/', '/login', '/register', '/forgot-password', '/product-request']);
const PUBLIC_PREFIXES = ['/products', '/search', '/categories'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function getRequiredRole(pathname: string): string | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/warehouse')) return 'warehouse';
  if (pathname.startsWith('/dashboard')) return 'customer';
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    if (pathname === '/login' || pathname === '/register') {
      const token = request.cookies.get('auth_token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          const dashboard = payload.role === 'admin' ? '/admin' : payload.role === 'warehouse' ? '/warehouse' : '/dashboard';
          return NextResponse.redirect(new URL(dashboard, request.url));
        }
      }
    }
    return NextResponse.next();
  }

  const requiredRole = getRequiredRole(pathname);
  if (!requiredRole) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return response;
  }

  if (payload.role !== requiredRole) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|design).*)',
  ],
};
