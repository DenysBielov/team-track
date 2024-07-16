'use client'

import { Team } from '@/lib/models/Team'
import React, { useEffect, useState } from 'react'
import { default as PositionComponent } from './Position'
import { useSession } from 'next-auth/react'
import { Suspension } from "@/lib/models/User"
import { getSuspension } from '@/lib/requests/user'
import BlockOverlay from '../BlockOverlay'

function Team({ team }: { team: Team }) {
  const positions = team.positions;
  const session = useSession();
  const [suspension, setSuspension] = useState<Suspension>()

  useEffect(() => {
    if (!session?.data?.user) {
      return
    }

    getSuspension(team.event.id!, session?.data?.user?.id!).then(s => {
      setSuspension(s)
    })
  }, [session])

  const isTeamFull = !team.positions?.find(p => !p.user)

  return (
    <div className='collapse collapse-arrow bg-primary/5 relative'>
      <input type="checkbox" defaultChecked={!isTeamFull} />
      <div className='collapse-title'>
        <div className='flex items-center justify-between w-full'>
          <span className='text-lg'>{team.name}</span>
          {team.positions && team.positions.length > 0 ?
            team.positions?.every(p => p.user) ?
              <span className='text-success'>Full</span> :
              <span className='text-accent'>Spots available</span>
            : <></>
          }
        </div>
      </div>
      <div className='collapse-content'>
        <div className='flex flex-col gap-2 relative'>
          {suspension && suspension.active && <BlockOverlay reason={suspension.reason} className='rounded-lg m-[-5px]' />}
          {positions && positions.length != 0 ? positions.map(p => <PositionComponent teamId={team.id!} position={p} key={p.id} />) : <span>No positions yet...</span>}
        </div>
      </div>
    </div>
  )
}

export default Team