import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Verify token by calling our verify API
    // (middleware runs in Edge runtime — we use a lightweight check)
    try {
      // Simple base64 payload check (full verify happens in API routes)
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) throw new Error('Token expired');
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
