import { auth } from '@/auth';
import { loadGroupsByAdmin } from '@/lib/requests/group';
import React from 'react'

async function GroupsPage() {
  const session = await auth();
  const user = session?.user;

  const groups = await loadGroupsByAdmin(user?.id!);

  return (
    <div>
      <div>
        {groups && groups.length > 0 && groups.map(group => <div key={group.id}>{group.name}</div>)}
      </div>
    </div>
  )
}

export default GroupsPage