import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public routes - allow access
    if (path === "/" || path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const roles = (token.roles as Role[]) || [];

    // Parent portal routes
    if (path.startsWith("/parent")) {
      if (!roles.includes(Role.PARENT)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Teacher portal routes
    if (path.startsWith("/teacher")) {
      if (!roles.includes(Role.TEACHER)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Admin portal routes
    if (path.startsWith("/admin")) {
      if (!roles.includes(Role.ADMIN) && !roles.includes(Role.PRINCIPAL)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Executive portal routes
    if (path.startsWith("/exec")) {
      if (!roles.includes(Role.EXECUTIVE) && !roles.includes(Role.PRINCIPAL)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: [
    "/parent/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/exec/:path*",
    "/api/v1/:path*",
  ],
};
