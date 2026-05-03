import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const src =
    process.env.NODE_ENV === 'development'
      ? {
          script: "'unsafe-eval' 'unsafe-inline'",
          style: "'unsafe-inline'",
        }
      : {
          script: `'nonce-${nonce}' 'strict-dynamic'`,
          style: `'nonce-${nonce}'`,
        }

  const cspHeader = `
    default-src 'self';
    script-src 'self' ${src.script};
    style-src 'self' ${src.style};
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  const response = intlMiddleware(request)

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
