import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

async function baseProxy(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;

  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  const isAdmin = token?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return null;
  }

  const isProtectedApiContact =
    isApiRoute && pathname.startsWith("/api/contact");

  if (!isAuth && (isAdminPage || isProtectedApiContact)) {
    if (isApiRoute) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  if (isAdminPage && !isAdmin) {
    if (isApiRoute) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  return NextResponse.next();
}

const proxy = withAuth(baseProxy, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export default proxy;

export const config = {
  matcher: ["/admin/:path*", "/api/contact/:path*"],
};