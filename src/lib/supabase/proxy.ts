import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/sign-up', '/confirm', '/check-email']

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.match(/^\/(en|vi)\/(login|sign-up|auth\/)/)
  const isPublicRoute = PUBLIC_ROUTES.some((route) => request.nextUrl.pathname.endsWith(route))

  if (!user && !isAuthRoute && !isPublicRoute) {
    const locale = request.nextUrl.pathname.startsWith('/en') ? 'en' : 'en'
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return response
}
