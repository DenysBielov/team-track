import { loadLocations } from '@/lib/requests/locations';
import React from 'react'
import EventForm from '../../../../components/Event/EventForm';

async function AdminCreateEventPage() {
  const locations = await loadLocations();

  return (
    <EventForm locations={locations}>
      <button className='btn btn-success text-neutral-50 w-full'>Create</button>
    </EventForm>
  )
}

export default AdminCreateEventPage