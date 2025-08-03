'use client'

import { Team as TeamModel } from '@/lib/models/Team'
import React, { useEffect, useState } from 'react'
import { default as PositionComponent } from "@/components/Position/Position"
import { useSession } from 'next-auth/react'
import { Suspension } from "@/lib/models/User"
import { getSuspension } from '@/lib/requests/user'
import BlockOverlay from '../BlockOverlay'
import TeamMenu from './TeamMenu'
import { User } from 'next-auth'

function Team({ team: defaultTeam }: { team: TeamModel }) {
  const [team, setTeam] = useState(defaultTeam)
  const [positions, setPositions] = useState(team.positions);
  const [suspension, setSuspension] = useState<Suspension>()
  const session = useSession();
  const user = session?.data?.user
  const captain = team.captain;

  useEffect(() => {
    if (!team?.id) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/${team.id}`);

    ws.onmessage = (event) => {
      if (!positions) return;

      const message = JSON.parse(event.data);
      if (message.type === "position_taken") {
        const updated_position = message.data;
        setPositions((prevPositions) => {
          const updatedPositions = prevPositions.map((p) =>
            p.id === updated_position.id ? updated_position : p
          );

          return updatedPositions;
        });
      }
      if (message.type === "position_released") {
        const updated_position = message.data;
        setPositions((prevPositions) => {
          const updatedPositions = prevPositions.map((p) => {
            if (p.id === updated_position.id) {
              return { ...p, user: null };
            }

            return p;
          });

          return updatedPositions;
        });
      }
    };

    return () => {
      console.log("closing websockets")
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    };
  }, [team.id]);

  useEffect(() => {
    if (!session?.data?.user) {
      return
    }

    getSuspension(team.event.id!, session?.data?.user?.id!).then(s => {
      setSuspension(s)
    })
  }, [session])

  const handleCaptainAssigned = (user?: User) => {
    setTeam({ ...team, captain: user });
  }

  const isAdmin = user && team.event.admins.find(a => a.id === user.id)
  const isCaptain = captain && user && captain.id === user.id
  const isTeamFull = !positions?.find(p => !p.user)

  return (
    <div className='collapse collapse-arrow bg-primary/5 relative'>
      <input type="checkbox" defaultChecked={!isTeamFull} />
      <div className='collapse-title'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex gap-2'>
              <span className='text-lg'>{team.name}</span>
              <TeamMenu team={team} onCaptainAssigned={handleCaptainAssigned} />
            </div>
            {positions && positions.length > 0 ?
              positions?.every(p => p.user) ?
                <span className='text-success'>Full</span> :
                <span className='text-accent'>Spots available</span>
              : <></>
            }
          </div>
          {
            captain && <div className='flex gap-2 items-center'>
              <span className='text-sm'>👑 Captain:</span>
              <span className='text-sm font-bold'>{captain.name}</span>
            </div>
          }
        </div>
      </div>
      <div className='collapse-content'>
        <div className='flex flex-col gap-2 relative'>
          {suspension && suspension.active && <BlockOverlay reason={<div className='text-center'>{suspension.reason}<br /><a href='/payments' className='link'>See my payments</a></div>} className='rounded-lg m-[-5px]' />}
          {team.captain && !isCaptain && !isAdmin && <BlockOverlay reason={<div>Only captain or admin can assign players</div>} className='rounded-lg m-[-5px]' />}
          {positions && positions.length != 0 ? positions.map(p => <PositionComponent isCaptain={p.user && p.user.id === captain?.id} team={team} position={p} key={p.id + p.user?.id} />) : <span>No positions yet...</span>}
        </div>
      </div>
    </div>
  )
}

export default Team