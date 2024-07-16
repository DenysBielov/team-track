import { NextRequest, NextResponse } from "next/server"
import { getSession } from "../actions"

// This function can be marked `async` if using `await` inside
export function authMiddleware(request: NextRequest) {
  const user = getSession()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
}