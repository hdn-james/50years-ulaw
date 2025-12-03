import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /login
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow authenticated users to continue
    return NextResponse.next();
  }

  // For /login page, redirect to admin if already logged in
  if (pathname === "/login") {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      // Already logged in, redirect to admin
      const redirectTo = request.nextUrl.searchParams.get("redirect") || "/admin";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
