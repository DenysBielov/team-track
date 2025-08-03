'use client'

import UserMenu from "./UserMenu"
import { useAuth } from "@/lib/auth/authContext"
import { usePathname } from "next/navigation"


function Header() {
  const { user } = useAuth()
  const pathname = usePathname()
  
  // Don't show header on auth pages
  const isAuthPage = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/confirm-email'].includes(pathname)
  
  if (isAuthPage) {
    return null
  }
  
  return (
    <div className="navbar px-4">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Team Track</a>
      </div>
      <div className="navbar-end">
        <UserMenu user={user} />
      </div>
    </div>
  )
}

export default Header