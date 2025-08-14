import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: We don't use auth() directly in middleware because it can't access the session
// in middleware. Instead, we rely on the admin layout to check for admin privileges.

export function middleware(request: NextRequest) {
  // We only redirect to the auth page if we're on an admin route and the user is not logged in
  // The admin layout component will handle the role check
  
  // For now, just allow the request through
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
