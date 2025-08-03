'use client'

import React, { useState, useEffect } from 'react'
import Avatar from '@/components/Common/Avatar'
import { followUser, getUser } from '@/lib/requests/user'
import { redirect } from 'next/navigation'
import Loader from '@/components/Loader'
import { Event } from '@/lib/models/Event'
import { loadEventsByUser } from '@/lib/requests/events'
import { User } from '@/lib/models/User'

function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User>()
  const [profile, setProfile] = useState<User>()
  const [events, setEvents] = useState<Event[]>()
  const { id } = params

  useEffect(() => {
    getUser(id as string).then((profile) => {
      if (!profile) {
        redirect("/404")
      }

      setProfile(profile)
    })
  }, [id])

  useEffect(() => {
    loadEventsByUser(id as string).then((events) => {
      setEvents(events)
    })
  }, [id])

  if (!user) {
    redirect("/login")
  }

  if (!id) {
    redirect("/404")
  }

  const handleFollow = () => {
    followUser
  }

  return (
    profile ?
      <div>
        <div className='flex items-center flex-col gap-4'>
          <Avatar profile={user} size="large" />
          <div>
            {profile.name}
          </div>
          {
            profile.id !== user?.id &&
            <button className='btn btn-info btn-md w-32'>
              Follow
            </button>
          }
        </div>
        <div>
          <h2>Events</h2>
          {events ?
            events?.map((event) => {
              return (
                <div key={event.id}>
                  {event.name}
                </div>
              )
            }) :
            <Loader />
          }
        </div>
      </div> :
      <Loader />
  )
}

export default ProfilePage