import { clerkMiddleware } from "@clerk/nextjs/server"
import createIntlMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing, locales } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return { locale, pathname: "/" }
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, pathname: pathname.slice(locale.length + 1) }
    }
  }

  return { locale: null as string | null, pathname }
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

function createNonce() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:`,
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "img-src 'self' data: https: https://img.clerk.com",
    "font-src 'self' data: https://cdn.jsdelivr.net",
    "connect-src 'self' https: https://*.clerk.accounts.dev https://clerk.rendiichtiar.com wss://ws-ap1.pusher.com",
    "frame-src 'self' blob:",
    "worker-src 'self' blob:",
  ].join("; ")
}

function applySecurityHeaders(res: NextResponse, nonce: string) {
  res.headers.set("Content-Security-Policy", buildCsp(nonce))
  res.headers.set("x-nonce", nonce)
  return res
}

function safeLocaleFrom(raw: string | null) {
  const loc =
    raw && locales.includes(raw as (typeof locales)[number]) ? raw : null
  return (loc ?? routing.defaultLocale) as (typeof locales)[number]
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const nonce = createNonce()

  const { locale, pathname: normalizedPath } = stripLocale(req.nextUrl.pathname)
  const safeLocale = safeLocaleFrom(locale)

  if (isAdminPath(normalizedPath)) {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) {
      const res = redirectToSignIn({ returnBackUrl: req.url })
      return applySecurityHeaders(res, nonce)
    }

    const adminId = process.env.ADMIN_CLERK_ID
    const isAdmin = !!adminId && userId === adminId

    if (!isAdmin) {
      const res = NextResponse.redirect(
        new URL(`/${safeLocale}/forbidden`, req.url)
      )
      return applySecurityHeaders(res, nonce)
    }
  }

  const intlRes = intlMiddleware(req)
  if (intlRes) return applySecurityHeaders(intlRes, nonce)

  return applySecurityHeaders(NextResponse.next(), nonce)
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
