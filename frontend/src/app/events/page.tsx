import React from 'react'
import { loadEventsByUser } from '@/lib/requests/events'
import EventList from '@/components/Event/EventsList';
import { redirect } from 'next/navigation';
import { loadGroupsByUser } from '@/lib/requests/groups';
import { getUserProfile } from '@/lib/server/auth';

async function EventsPage() {
  const user = await getUserProfile();
  console.log('Events page - user profile:', user);
  
  if (!user) {
    console.log('No user found, redirecting to login');
    redirect('/login');
    return;
  }
  
  const events = await loadEventsByUser(user.id!);
  const groups = await loadGroupsByUser(user.id!);

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-xl'>Events</h1>
      {
        events && events.length > 0 ?
          <EventList events={events} /> :
          <div className='text-center'>No events found</div>
      }
      <a href='/events/create' className='btn btn-primary btn-circle fixed right-9 bottom-32 font-bold text-2xl'>+</a>
    </div>
  )
}


export default EventsPage