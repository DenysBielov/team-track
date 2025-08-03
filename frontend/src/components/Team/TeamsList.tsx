'use client'

import { Team } from '@/lib/models/Team'
import React from 'react'
import { default as TeamComponent } from './Team';

function TeamsList({ teams }: { teams: Team[] }) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        {teams && teams.length > 0 ?
          teams.map(t => <TeamComponent key={t.id} team={t} />) :
          <span>No teams yet...</span>}
      </div>
    </div>
  )
}

export default TeamsList