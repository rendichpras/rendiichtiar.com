import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
    const isApiRoute = req.nextUrl.pathname.startsWith("/api")

    // Cek apakah user adalah admin
    const isAdmin = token?.email === process.env.ADMIN_EMAIL

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url))
      }
      return null
    }

    if (!isAuth && (isAdminPage || (isApiRoute && req.nextUrl.pathname.startsWith("/api/contact")))) {
      if (isApiRoute) {
        return new NextResponse("Unauthorized", { status: 401 })
      }
      return NextResponse.redirect(new URL("/forbidden", req.url))
    }

    if (isAdminPage && !isAdmin) {
      if (isApiRoute) {
        return new NextResponse("Forbidden", { status: 403 })
      }
      return NextResponse.redirect(new URL("/forbidden", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Konfigurasi path yang dilindungi
export const config = {
  matcher: ["/admin/:path*", "/api/contact/:path*"],
} 