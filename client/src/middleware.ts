import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/auth/login', '/auth/register', '/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    // If logged in and trying to access public routes, redirect to dashboard
    if (token && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};