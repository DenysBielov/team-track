import React from 'react'
import { loadEvents } from '@/lib/requests/events'
import EventList from '@/components/Event/EventsList';

async function EventsPage() {
  const events = await loadEvents();

  return (
    <div>
      <EventList events={events} />
    </div>
  )
}


export default EventsPage