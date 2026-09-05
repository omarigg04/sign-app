import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedRoutes = ['/dashboard', '/shop']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Special case for /sign (but not /sign-in or /sign-up)
  const isSignPage = request.nextUrl.pathname === '/sign' || request.nextUrl.pathname.startsWith('/sign/')
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || request.nextUrl.pathname.startsWith('/sign-up')

  // API routes that need auth
  const protectedApiRoutes = ['/api/signatures', '/api/stripe']
  const isProtectedApi = protectedApiRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Webhook routes don't require auth
  const isWebhook = request.nextUrl.pathname.startsWith('/api/webhooks')

  if ((isProtectedRoute || isSignPage || (isProtectedApi && !isWebhook)) && !user && !isAuthPage) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/sign-in'
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
