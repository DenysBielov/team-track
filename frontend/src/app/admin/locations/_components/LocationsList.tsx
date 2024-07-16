'use client'

import React, { useRef, useState } from 'react'
import { Location } from "@/lib/models/Event";
import { FiTrash as TrashIcon } from 'react-icons/fi'
import ConfirmationModal from '@/components/ConfirmationModal';
import { deleteLocation as deleteLocationRequest } from "@/lib/requests/locations";
import { useRouter } from 'next/navigation';

function LocationsList({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location>()
  const confirmationModal = useRef<HTMLDialogElement>(null);

  const confirmDelete = (location: Location) => {
    setSelectedLocation(location);

    confirmationModal.current?.showModal();
  }

  const deleteLocation = async () => {
    await deleteLocationRequest(selectedLocation?.id!);
    
    router.refresh();
  }

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(l => <tr key={l.id}>
            <td>{l.name}</td>
            <td>{l.address}</td>
            <td><button className='btn btn-ghost text-error' onClick={() => confirmDelete(l)}><TrashIcon size={"1.5rem"} /></button></td>
          </tr>)}
        </tbody>
      </table>
      <ConfirmationModal ref={confirmationModal} question={`Are you sure you want to delete ${selectedLocation?.name}?`} confirm={deleteLocation} />
    </>
  )
}

export default LocationsList