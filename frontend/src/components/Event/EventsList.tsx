'use client'

import React, { useRef, useState } from 'react'
import { Event } from "@/lib/models/Event";
import { FiTrash as TrashIcon } from 'react-icons/fi'
import ConfirmationModal from '@/components/ConfirmationModal';
import { deleteEvent as deleteEventRequest } from "@/lib/requests/events";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import moment from 'moment';

function EventList({ events }: { events: Event[] }) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<Event>()
  const confirmationModal = useRef<HTMLDialogElement>(null);

  const confirmCancel = (event: Event) => {
    setSelectedEvent(event);

    confirmationModal.current?.showModal();
  }

  const deleteEvent = async () => {
    await deleteEventRequest(selectedEvent?.id!);

    router.refresh();
  }

  return (
    <>
      {events.map(e =>
        <Link key={e.id} href={`/events/${e.id}`}>
          <div className='card bg-[#011B28] text-gray-100 p-4 flex flex-col gap-2'>
            <div>
              <span className='font-bold'>Date:</span>{" "}
              <span>{moment(e.date).format("dddd, DD MMM YYYY")}</span>
            </div>
            <div>
              <span className='font-bold'>Time:</span>{" "}
              <span>{e.startTime.substring(0, 5)}-{e.endTime.substring(0, 5)}</span>
            </div>
            <div>
              <span className='font-bold'>Location:</span>{" "}
              <span>{e.location.name}</span>
            </div>
          </div>
        </Link>
      )}
      <ConfirmationModal ref={confirmationModal} question={`Are you sure you want to cancel ${selectedEvent?.name}?`} confirm={deleteEvent} />
    </>
  )
}

export default EventList