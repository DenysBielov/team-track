import { loadLocations } from '@/lib/requests/locations';
import React from 'react'
import CreateEventForm from '@/components/Forms/Event/CreateEventForm';

async function AdminCreateEventPage() {
  const locations = await loadLocations();

  return (
    <CreateEventForm locations={locations}>
    </CreateEventForm>
  )
}

export default AdminCreateEventPage