import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isProtectedContactApi = createRouteMatcher(["/api/contact(.*)"])

import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  const pathname = req.nextUrl.pathname
  const isStaticFile = pathname.includes(".")

  if (!pathname.startsWith("/api") && !isStaticFile) {
    const intlResponse = intlMiddleware(req)
    if (intlResponse) return intlResponse
  }

  if ((isAdminRoute(req) || isProtectedContactApi(req)) && !userId) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.redirect(new URL("/forbidden", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
  ],
}
