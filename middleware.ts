import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value
  const path = request.nextUrl.pathname

  // Define protected routes that require authentication
  const protectedRoutes = ["/profile", "/settings"]

  // Check if the route requires authentication
  if (protectedRoutes.some((route) => path.startsWith(route)) && !sessionId) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile/:path*", "/settings/:path*"],
}
