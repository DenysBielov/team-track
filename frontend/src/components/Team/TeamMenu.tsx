'use client'

import { Team } from '@/lib/models/Team';
import { useSession } from 'next-auth/react';
import React from 'react'
import { FaEllipsisH as MenuIcon } from 'react-icons/fa'
import Modal from '../Common/Modal';
import UserSearch from '../User/UserSearch';
import { User } from 'next-auth';
import { assignCaptain as assignCaptainRequest } from '@/lib/requests/teams';

type TeamMenuProps = {
  team: Team
  onCaptainAssigned: (user?: User) => void
}

function TeamMenu({ team, onCaptainAssigned }: TeamMenuProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const user = session?.data?.user;

  const isAdmin = !!team.event.admins.find(a => a.id == user?.id);

  if (!isAdmin) {
    return null;
  }

  if (!team) {
    return null;
  }

  const assignCaptain = (user?: User) => {
    setIsLoading(true);
    assignCaptainRequest(team.id!, user?.id!).then(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      onCaptainAssigned && onCaptainAssigned(user);
    }).catch(() => {
      setIsLoading(false);
    })
  }

  return (
    <div className="dropdown dropdown-start z-50">
      <MenuIcon tabIndex={0} role="button" className="m-1" />
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
        <li><button onClick={() => setIsModalOpen(true)}>Assign a captain</button></li>
        {team.captain && <li> <button onClick={() => assignCaptain(undefined)}>Remove the captain</button></li>}
      </ul>
      <Modal isLoading={isLoading} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserSearch onUserSelect={assignCaptain} />
      </Modal>
    </div>
  )
}

export default TeamMenu