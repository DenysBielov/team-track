import { auth } from '@/auth';
import { loadClubsByAdmin } from '@/lib/requests/club';
import React from 'react'

async function ClubsPage() {
  const session = await auth();
  const user = session?.user;

  const clubs = await loadClubsByAdmin(user?.id!);

  return (
    <div>
      <div>
        {clubs && clubs.length > 0 && clubs.map(club => <div key={club.id}>{club.name}</div>)}
      </div>
    </div>
  )
}

export default ClubsPage