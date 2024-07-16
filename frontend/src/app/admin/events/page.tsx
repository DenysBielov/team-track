import { loadEvents } from '@/lib/requests/events'
import Link from 'next/link';
import React from 'react'
import { FiPlus as PlusIcon } from 'react-icons/fi'
import EventList from '@/components/Event/EventsList';

async function AdminEvents() {
  const events = await loadEvents();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <span className='font-bold text-lg'>Events</span>
        <div>
          <Link href={"/admin/events/create"} className='btn btn-sm btn-success'><PlusIcon /></Link>
        </div>
      </div>
      <EventList events={events} />
    </div>
  )
}

export default AdminEvents