import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest, event: NextFetchEvent) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      isAuthenticated &&
      token.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/unauthorise", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/manager") &&
      isAuthenticated &&
      token.role !== "MANAGER"
    ) {
      return NextResponse.rewrite(new URL("/unauthorise", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/staff") &&
      isAuthenticated &&
      token.role !== "STAFF"
    ) {
      return NextResponse.rewrite(new URL("/unauthorise", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
