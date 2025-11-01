import { clerkMiddleware } from '@clerk/nextjs/server';

// Only enforce auth on specific app sections; keep landing and sign-in public
export default clerkMiddleware(
  (auth, req) => {
    // No-op; Clerk will handle redirects for protected routes
  },
  {
    publicRoutes: ['/', '/login', '/sign-in', '/sign-up', '/buyer/product/(.*)'],
  }
);

export const config = {
  matcher: [
    '/welcome',
    '/farmer/:path*',
    '/buyer/:path*',
    '/admin/:path*',
    '/role-selection',
    // Always run for API routes (if any used in Next.js)
    '/(api|trpc)(.*)',
  ],
};