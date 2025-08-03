import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export async function authMiddleware(request: NextRequest) {
  const session = await auth()
  const user = session?.user
  console.error('authMiddleware - user:', user)
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
}