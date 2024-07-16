import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

// This function can be marked `async` if using `await` inside
export default async function authMiddleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
}