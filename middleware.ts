import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access dashboard without being logged in
    if (req.nextUrl.pathname.startsWith("/dashboard") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check if user is trying to access HR-only routes
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      req.nextauth.token?.role !== "hr"
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }

        // Require authentication for dashboard
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token && token.role === "hr";
        }

        // Allow access to all other pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
