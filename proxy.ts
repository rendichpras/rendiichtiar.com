import { clerkMiddleware } from "@clerk/nextjs/server"
import createIntlMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/require-admin"
import { routing, locales } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return { locale, pathname: "/" }
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
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

function buildCsp(nonce: string) {
  const isDev = process.env.NODE_ENV !== "production"

  const scriptSrc = [
    "script-src",
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ")

  const scriptSrcElem = [
    "script-src-elem",
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    scriptSrc,
    scriptSrcElem,

    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",

    "img-src 'self' data: https: https://img.clerk.com",
    "font-src 'self' data: https://cdn.jsdelivr.net",
    "connect-src 'self' https: https://*.clerk.accounts.dev https://clerk.rendiichtiar.com wss://ws-ap1.pusher.com",

    "frame-src 'self' blob: https://vercel.live",
    "worker-src 'self' blob:",
  ].join("; ")
}

function applySecurityHeaders(res: NextResponse, nonce: string) {
  res.headers.set("Content-Security-Policy", buildCsp(nonce))
  res.headers.set("x-nonce", nonce)
  return res
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const nonce = createNonce()
  const { pathname } = req.nextUrl

  const isStaticFile = pathname.includes(".")
  const isApiRoute = pathname.startsWith("/api") || pathname.startsWith("/trpc")

  if (!isApiRoute && !isStaticFile) {
    const res = intlMiddleware(req)
    if (res) return applySecurityHeaders(res, nonce)
  }

  const { locale, pathname: normalizedPath } = stripLocale(pathname)

  if (isAdminPath(normalizedPath)) {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) {
      const res = redirectToSignIn({ returnBackUrl: req.url })
      return applySecurityHeaders(res, nonce)
    }

    try {
      await requireAdmin()
    } catch {
      const safeLocale =
        (locale && routing.locales.includes(locale as (typeof locales)[number])
          ? locale
          : routing.defaultLocale) ?? routing.defaultLocale

      const res = NextResponse.redirect(
        new URL(`/${safeLocale}/forbidden`, req.url)
      )
      return applySecurityHeaders(res, nonce)
    }
  }

  return applySecurityHeaders(NextResponse.next(), nonce)
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
