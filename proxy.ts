import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isProtectedContactApi = createRouteMatcher(["/api/contact(.*)"])

export const proxy = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
