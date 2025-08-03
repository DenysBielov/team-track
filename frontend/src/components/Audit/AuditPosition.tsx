'use client'

import { Position } from '@/lib/models/Position'
import React from 'react'
import Avatar from '../Common/Avatar'
import Loader from '../Loader'
import { markPositionPaid } from '@/lib/requests/positions'
import { FaCheck } from 'react-icons/fa6'

type AuditPositionProps = {
  defaultPosition: Position
}

function AuditPosition({ defaultPosition }: AuditPositionProps) {
  const [position, setPosition] = React.useState<Position>(defaultPosition)
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePaid = (positionId: string) => {
    setIsLoading(true)
    markPositionPaid(positionId)
      .then(() => {
        setIsLoading(false)
        setPosition({ ...position, paid: true })
      })
  }

  return (
    <div className='bg-primary rounded-md p-2 text-primary-content flex justify-between items-center relative' key={position!.id}>
      {isLoading && <Loader className="absolute inset-0 bg-black/55 text-white" />}
      <div className='flex gap-2 items-center'>
        <Avatar profile={position!.user} />
        <span>{position!.user?.name}</span>
      </div>
      <div>
        {position?.paid ? <span className='flex gap-2 items-center'><FaCheck /> Paid </span> :
          <button className='btn btn-sm btn-success' onClick={() => handlePaid(position?.id)}>Paid</button>}
      </div>
    </div>
  )
}

export default AuditPosition