import { auth } from '@/auth'
import AuditPosition from '@/components/Audit/AuditPosition'
import Avatar from '@/components/Common/Avatar'
import { loadEvent } from '@/lib/requests/events'
import { loadTeams } from '@/lib/requests/teams'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

type AuditPageProps = {
  params: {
    id: string
  }
}

async function AuditPage({ params }: AuditPageProps) {
  if (!params || !params.id) {
    notFound()
  }

  const session = getCurretn;
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin")
  }

  // TODO: Too many requests
  const event = await loadEvent(params.id)

  if (!event) {
    notFound()
  }

  const teams = await loadTeams(params.id)

  const positions = teams.flatMap(team => team.positions).filter(position => !!position).filter(position => position?.user)

  return (
    <div>
      <h1>{event.name}</h1>
      <div>
        <div>
          Costs: £{event.cost} total, £{event.cost / positions.length} per person
        </div>
      </div>
      <h2>Positions</h2>
      <div className='flex flex-col gap-2'>
        {positions.map(position => (
          <AuditPosition key={position!.id} defaultPosition={position!} />
        ))}
      </div>
    </div>
  )
}

export default AuditPage