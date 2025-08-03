'use client'

import React, { useState } from 'react'
import { FiPlus as PlusIcon } from 'react-icons/fi'
import Loader from '../Loader'
import { usePosition } from '@/hooks/usePosition'
import { useSession } from 'next-auth/react'
import PositionWithUser from './PositionWithUser'
import { Position as PositionModel } from '@/lib/models/Position'
import { Team } from '@/lib/models/Team'
import Modal from '../Common/Modal'
import UserSearch from '../User/UserSearch'

type PositionProps = {
  position: PositionModel
  team: Team
  isCaptain: boolean
}

function Position({ position: defaultPosition, team }: PositionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const { position, isLoading, isConfirming, confirmPosition, cancel, assignPosition, takePosition, leavePosition } = usePosition(defaultPosition, user)

  return (
    <div className='relative'>
      {isLoading && <Loader className="absolute inset-0 bg-black/55 rounded-md z-50" />}
      {position.user ? (
        <PositionWithUser onPositionLeave={leavePosition} position={position} userId={user?.id!} team={team} />
      ) : (
        <div className='p-4 h-14 rounded-md bg-black/20 w-full flex justify-between' onClick={() => !isConfirming && confirmPosition()}>
          <span className='font-bold'>{position.name}</span>
          {isConfirming ? (
            <div className='flex justify-between gap-2'>
              <button className='text-error z-40' onClick={cancel}>Cancel</button>
              <button className='text-success' onClick={takePosition}>Take position</button>
              {team.captain && team.captain.id === user?.id && <button className='text-warning' onClick={() => setIsModalOpen(true)}>Assign</button>}
            </div>
          ) : (
            <button><PlusIcon /></button>
          )}
        </div>
      )}

      <Modal isLoading={isLoading} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserSearch onUserSelect={assignPosition} />
      </Modal>
    </div>
  )
}

export default Position