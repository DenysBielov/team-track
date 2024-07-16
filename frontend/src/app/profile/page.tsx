import React from 'react'
import UserSettings from './_components/UserSettings'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

async function ProfilePage() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect("/login")
  }

  return (
    <div>
      <UserSettings user={user}></UserSettings>
    </div>
  )
}

export default ProfilePage