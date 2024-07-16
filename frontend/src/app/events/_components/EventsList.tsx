import React from 'react'
import { Event } from '@/lib/models/Event'
import moment from 'moment'
import Link from 'next/link'

function EventComponent({ event }: { event: Event }) {
  const time = [event.startTime, event.endTime].join("-");

  return (
    <Link href={`/events/${event.id}`} className='card bg-neutral p-4' key={event.id}>
      <span>{moment(event.date).format("DD MMMM")} {time}</span>
      <span>{event.location?.name}</span>
    </Link>
  )
}

function EventList({ events }: { events: Event[] }) {
  const pastEvents = events.filter(e => e.date < new Date())
  const futureEvents = events.filter(e => e.date >= new Date())

  return (
    <div className='flex flex-col gap-4'>
      <span>Future Events</span>
      {futureEvents && futureEvents.length > 0 ?
        futureEvents.map(e => <EventComponent key={e.id} event={e} />) :
        <span className='text-center'>No events...</span>}
      <span>Past Events</span>
      {pastEvents && pastEvents.length > 0 ?
        pastEvents.map(e => <EventComponent key={e.id} event={e} />) :
        <span className='text-center'>No events...</span>}
    </div>
  )
}

export default EventList