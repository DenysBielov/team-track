import { auth } from '@/auth'
import { Event } from '@/lib/models/Event'
import Link from 'next/link'
import React from 'react'
import { FaEllipsisH } from 'react-icons/fa'

type EventMenuProps = {
  event: Event
}

const EventMenu = async ({ event }: EventMenuProps) => {
  const session = await auth();
  const user = session?.user;

  const isAdmin = !!event.admins.find(a => a.id == user?.id);

  return (
    <div className="dropdown dropdown-end">
      <FaEllipsisH tabIndex={0} role="button" className="m-1" />
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
        <li><a>Copy URL</a></li>
        {isAdmin &&
          <>
            <li><Link href={`/events/${event.id}/edit`}>Edit</Link></li>
            <li><Link href={`/audit/${event.id}`}>Start audit</Link></li>
          </>
        }
      </ul>
    </div>
  )
}

export default EventMenu