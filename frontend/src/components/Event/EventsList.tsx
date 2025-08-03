'use client'

import React from 'react'
import { Event } from "@/lib/models/Event";
import Link from 'next/link';
import moment from 'moment';
import { FcCalendar as CalendarIcon, FcClock as ClockIcon, FcHome as LocationIcon } from "react-icons/fc";

type EventListProps = {
  events: Event[]
}

function EventList({ events }: EventListProps) {


  return (
    <div className='flex flex-col gap-4'>
      {events && events.length > 0 ? events.map(e =>
        <Link key={e.id} href={`/events/${e.id}`}>
          <div className='card bg-secondary text-gray-100 p-4 flex flex-col gap-2'>
            <div className='flex gap-1 items-center'>
              <CalendarIcon />
              <span className='font-bold'>Date:</span> {moment(e.date).format("dddd, DD MMM YYYY")}
            </div>
            <div className='flex gap-1 items-center'>
              <ClockIcon />
              <span className='font-bold'>Time:</span>{" "}
              <span>{e.startTime.substring(0, 5)}-{e.endTime.substring(0, 5)}</span>
            </div>
            <div className='flex gap-1 items-center'>
              <LocationIcon />
              <span className='font-bold'>Location:</span>
              <span>{e.location?.name}</span>
            </div>
          </div>
        </Link>
      ) :
        <div className='text-center text-gray-400'>
          No events available
        </div>}
    </div>
  )
}

export default EventList