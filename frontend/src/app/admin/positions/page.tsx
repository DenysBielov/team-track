import { loadPositionTypes } from '@/lib/requests/positions'
import Link from 'next/link';
import React from 'react'
import { FiPlus as PlusIcon } from 'react-icons/fi'
import PositionsList from './_components/PositionsList';

async function AdminPositions() {
  const positions = await loadPositionTypes();

  return (
    <div>
      <div className='flex justify-between'>
        <span className='font-bold text-lg'>Positions</span>
        <div>
          <Link href={"/admin/positions/create"} className='btn btn-sm btn-success'><PlusIcon /></Link>
        </div>
      </div>
      <PositionsList positions={positions}/>
    </div>
  )
}

export default AdminPositions