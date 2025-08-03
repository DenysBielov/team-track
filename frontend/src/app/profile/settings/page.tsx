import React from 'react'
import UserSettings from '../_components/UserSettings'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

async function ProfileSettingsPage() {
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

export default ProfileSettingsPage