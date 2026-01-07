import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/sign(.*)',
  '/upgrade(.*)',
  '/api/signatures(.*)',
  '/api/stripe(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (isProtectedRoute(request) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
