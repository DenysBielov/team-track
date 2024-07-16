import { User } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsBell as BellIcon } from 'react-icons/bs'
import { FiLogIn as LoginIcon } from 'react-icons/fi'

function UserMenu({ user }: UserMenuProps) {
  return (
    <div>
      {user ?
        <div className='flex gap-4 items-center'>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator" >
              <BellIcon size={"18px"} />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div >
          </button>
          <div className='bg-slate-300 text-slate-800 font-bold w-10 h-10 rounded-[50%] text-center flex items-center justify-center cursor-pointer'>
            <Link href={"/profile"}>
              {
                user.image ?
                  <Image className='rounded-[50%]' src={user.image} width={40} height={40} alt='User image'></Image> :
                  <span>{user.name?.split(" ").map(w => w[0]).join(" ")}</span>
              }
            </Link>
          </div>
        </div>
        :
        <Link href={`/api/auth/signin`} className='btn btn-ghost btn-circle'><LoginIcon size={"18px"} /></Link>
      }
    </div>
  )
}

type UserMenuProps = {
  user: User | undefined
}

export default UserMenu