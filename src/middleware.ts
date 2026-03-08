import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Block test/debug routes in production
const TEST_ROUTES = ['/test', '/test-onboarding', '/test-setup'];

// Content-Security-Policy — tightened for production
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.flutterwave.com https://www.paypal.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://www.google-analytics.com",
  "connect-src 'self' https://api.flutterwave.com https://www.google-analytics.com https://vitals.vercel-insights.com https://api.paypal.com https://api.sandbox.paypal.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block test routes in production
  if (process.env.NODE_ENV === 'production') {
    const isTestRoute = TEST_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    if (isTestRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // NextAuth v5 uses "authjs.session-token" (not the v4 "next-auth.session-token")
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName,
    salt: cookieName,
  });

  // Build response and apply security headers to all routes
  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
  }

  // Protect authenticated routes
  const protectedRoutes = ['/dashboard', '/profile', '/post-job', '/applications'];
  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r));

  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Protect employer-specific routes
  if (pathname.startsWith('/post-job') && token?.role !== 'EMPLOYER' && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/post-job/:path*',
    '/applications/:path*',
    '/test/:path*',
    '/test-onboarding/:path*',
    '/test-setup/:path*',
    // Apply security headers globally (excludes static files & _next)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
