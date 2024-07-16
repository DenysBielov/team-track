import ConfirmationModal from '@/components/ConfirmationModal';
import { loadLocations } from '@/lib/requests/locations';
import Link from 'next/link';
import React from 'react'
import { FiPlus as PlusIcon } from 'react-icons/fi'
import LocationsList from './_components/LocationsList';

async function AdminLocations() {
  const locations = await loadLocations();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <span className='font-bold text-lg'>Locations</span>
        <div>
          <Link href={"/admin/locations/create"} className='btn btn-sm btn-success'><PlusIcon /></Link>
        </div>
      </div>
      <LocationsList locations={locations} />
    </div>
  )
}

export default AdminLocations