'use client'

import { Position } from '@/lib/models/Position'
import React, { useState } from 'react'
import { FiPlus as PlusIcon, FiX as CancelIcon  } from 'react-icons/fi'
import Image from "next/image"
import Loader from '../Loader'
import { getPosition, takePositionWithUser } from '@/lib/requests/positions'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { releasePosition } from '@/lib/requests/positions'

function Position({ position: defaultPosition, teamId }: { position: Position, teamId: string }) {
  const session = useSession()
  const user = session.data?.user;

  const [position, setPosition] = useState<Position>(defaultPosition)
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const confirmPosition = () => {
    setIsConfirming(true);
  }

  const cancel = () => {
    setIsConfirming(false);
  }

  const takePosition = async () => {
    setIsConfirming(false);
    setIsLoading(true)
    takePositionWithUser(position.id, user!.id!)
      .then((newPosition) => {
        leaveWaitlistRequest(position.id, user!.id!).then(() => {
        })
        setPosition(newPosition)
        setIsLoading(false)
      })
  }

  const refreshPosition = () => {
    setIsLoading(true)
    getPosition(position.id).then(p => {
      setIsLoading(false)
      setPosition(p)
    })
  }

  const leavePosition = () => {
    setIsLoading(true)
    releasePosition(position.id).then(() => {
      refreshPosition()
    })
  }

  return (
    <div className='relative'>
      {isLoading && <Loader className="absolute inset-0 bg-black/55 rounded-md z-50" />}
      {position.user ? <PositionWithUser onPositionLeave={leavePosition} position={position} userId={user?.id!} teamId={teamId} /> : (
        <div className='p-4 h-14 rounded-md bg-black/20 w-full flex justify-between' onClick={() => !isConfirming && confirmPosition()}>
          <span className='font-bold'>{position.name}</span>
          {
            isConfirming ?
              (
                <div className='flex justify-between gap-2'>
                  <button className='text-error z-40' onClick={cancel}>Cancel</button>
                  <button className='text-success' onClick={takePosition}>Take position</button>
                </div >
              ) :
              <button><PlusIcon /></button>
          }
        </div>
      )
      }
    </div >
  )
}

import { joinWaitlist as joinWaitlistRequest, leaveWaitlist as leaveWaitlistRequest, loadWaitlist as loadWaitlistRequest } from "@/lib/requests/waitlist"

function PositionWithUser({ position, userId, teamId, onPositionLeave }: { position: Position, userId: string, teamId: string, onPositionLeave: Function }) {
  if (!position || !position.user) {
    return <></>
  }

  const [waitlist, setWaitlist] = useState<User[] | undefined>(undefined)
  const [isLoading, setisLoading] = useState<boolean>(false)

  const loadWaitlist = () => {
    setisLoading(true)
    loadWaitlistRequest(position.id).then(users => {
      setWaitlist(users)
      setisLoading(false)
    })
  }

  const joinWaitlist = () => {
    setisLoading(true)
    joinWaitlistRequest(position.id, userId).then(() => {
      loadWaitlist()
    })
  }

  const leaveWaitlist = () => {
    setisLoading(true)
    leaveWaitlistRequest(position.id, userId).then(() => {
      loadWaitlist()
    })
  }

  const leavePosition = () => {
    onPositionLeave && onPositionLeave(position.id)
  }

  const hideOtherWaitlists = (positionId: string) => {
    var checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${teamId}"]`);
    checkboxes.forEach(function (checkbox) {
      if (checkbox.id != positionId) {
        checkbox.checked = false
      }
    });
    if (waitlist === undefined) {
      loadWaitlist()
    }
  }

  return (
    <div tabIndex={0} className='collapse collapse-arrow bg-primary/90 text-primary-content rounded-md h-14' onFocus={() => hideOtherWaitlists(position.id)}>
      <input id={position.id} type="checkbox" name={teamId} />
      <div className='collapse-title p-4 h-14 rounded-md bg-primary w-full flex justify-between'>
        <div className=' flex items-center gap-2'>
          <Image alt={position.user.name!} className='avatar rounded' src={position.user.image!} width={32} height={32} />
          <span>{position.user.name}</span>
          {position.user.id == userId && <button className='btn btn-xs btn-error z-10' onClick={leavePosition}><CancelIcon /></button>}
        </div>
        <span className='place-self-center self-center font-bold mr-6'>
          {position.name}
        </span>
      </div>
      <div className="collapse-content relative">
        {isLoading && <Loader className="absolute inset-0 bg-black/55 z-50" />}
        <div className='py-2 w-full text-lg'>Waitlist</div>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-full items-center flex flex-col'>
            {
              waitlist && waitlist.length > 0 ? waitlist.map((user, idx) =>
                <div key={`waitlist-${position.id}-${user.id}`} className='flex w-full items-center justify-between gap-2'>
                  <div className='flex gap-2 items-center'>
                    <span>{idx + 1}.</span>
                    <Image alt={user.name!} className='avatar rounded' src={user.image!} width={32} height={32} />
                    <span>{user.name}</span>
                  </div>
                  {userId == user.id && <button className='link text-error' onClick={leaveWaitlist}><CancelIcon /></button>}
                </div>
              ) :
                <span className='text-sm'>Waitlist is empty</span>
            }
          </div>
          {position.user.id != userId && (!waitlist || !waitlist.find(u => u.id === userId)) && <button className='btn btn-sm text-primary-content bg-primary border-none' onClick={joinWaitlist}>Join waitlist</button>}
        </div>
      </div>
    </div>
  )
}

export default Position