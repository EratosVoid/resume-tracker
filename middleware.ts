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
      console.log("redirecting to login - not HR");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check if user is trying to access applicant-only routes
    if (
      req.nextUrl.pathname.startsWith("/applicant") &&
      req.nextauth.token?.role !== "applicant"
    ) {
      console.log("redirecting to login - not applicant");
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

        // Require authentication for applicant routes
        if (req.nextUrl.pathname.startsWith("/applicant")) {
          return !!token;
        }

        // Require authentication for dashboard
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Allow access to all other pages (jobs, resume, etc. - they'll show appropriate UI based on auth status)
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/applicant/:path*",
    "/jobs/:path*",
    "/resume/:path*",
  ],
};
