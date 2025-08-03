'use client'

import { User } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { FiLogIn as LoginIcon } from 'react-icons/fi'
import Avatar from '../Common/Avatar'
import { useAuth } from '@/lib/auth/authContext'


function UserMenu({ user }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout()
    setIsMenuOpen(false)
  }

  const links = [
    { href: '/profile/' + user?.id, label: 'Profile' },
    { href: '/profile/settings', label: 'Settings' },
  ]

  const toggleUserMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div ref={menuRef}>
      {user ?
        <div className='flex gap-4 items-center'>
          <div onClick={toggleUserMenu}>
            <Avatar profile={user} size='small' />
          </div>
          {isMenuOpen && (
            <div className='absolute top-12 right-0 bg-white shadow-lg rounded-lg py-2 w-48 z-50'>
              {links.map(link => (
                <Link key={link.label} href={link.href} className='block px-4 py-2 text-neutral-800 hover:bg-neutral-100' onClick={closeMenu}>{link.label}</Link>
              ))}
              <button onClick={handleLogout} className='block w-full text-left px-4 py-2 text-neutral-800 hover:bg-neutral-100'>
                Sign Out
              </button>
            </div>
          )}
        </div>
        :
        <Link href={`/login`} className='btn btn-ghost btn-circle'><LoginIcon size={"18px"} /></Link>
      }
    </div>
  )
}

type UserMenuProps = {
  user: User | undefined
}

export default UserMenu