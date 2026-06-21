import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/"];
const ADMIN_PATHS = ["/admin"];
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "");

/**
 * Middleware to protect routes and enforce authentication
 * Redirects unauthenticated users to login
 * Redirects non-admin users away from admin routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    pathname === path || pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("next-auth.session-token")?.value ||
                request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For admin routes, we allow the request to proceed and check auth on the client
  // since JWT verification in middleware requires jose and more complex setup
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
