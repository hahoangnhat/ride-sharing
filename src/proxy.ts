import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import createMiddleware from 'next-intl/middleware'
import { updateSession } from './lib/supabase/proxy'

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  let response = intlMiddleware(request)
  response = await updateSession(request, response)

  const supabaseHosts = [process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://*.supabase.co']
    .filter(Boolean)
    .join(' ')

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' ${supabaseHosts};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    worker-src 'self' blob:;
    manifest-src 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
