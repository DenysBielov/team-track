'use client'

import React, { useRef, useState } from 'react'
import { FiTrash as TrashIcon } from 'react-icons/fi'
import ConfirmationModal from '@/components/ConfirmationModal';
import { deletePosition as deletePositionRequest } from "@/lib/requests/positions";
import { useRouter } from 'next/navigation';
import { Position } from '@/lib/models/Position';

function PositionsList({ positions }: { positions: Position[] }) {
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useState<Position>()
  const confirmationModal = useRef<HTMLDialogElement>(null);

  const confirmDelete = (position: Position) => {
    setSelectedPosition(position);

    confirmationModal.current?.showModal();
  }

  const deletePosition = async () => {
    await deletePositionRequest(selectedPosition?.id!);

    router.refresh();
  }

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(p =>
            <tr key={p.id}>
              <td>{p.name}</td>
              <td><button className='btn btn-ghost text-error' onClick={() => confirmDelete(p)}><TrashIcon size={"1.5rem"} /></button></td>
            </tr>
          )}
        </tbody>
      </table>
      <ConfirmationModal ref={confirmationModal} question={`Are you sure you want to delete ${selectedPosition?.name}?`} confirm={deletePosition} />
    </>
  )
}

export default PositionsList