import { type NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'hy', 'ru']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for admin, API routes, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already contains a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Extract user's preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || ''
  const preferredLocale =
    acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0].toLowerCase())
      .find((lang) => locales.includes(lang)) || defaultLocale

  // Redirect to locale-specific path
  return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url))
}

export const config = {
  matcher: [
    // Match all paths except those explicitly handled above
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
