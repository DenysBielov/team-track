import { auth } from '@/auth';
import Link from 'next/link'
import UserMenu from "./UserMenu"


async function Header() {
  const session = await auth()
  const user = session?.user;

  return (
    <div className="navbar">
      <div className="navbar-start">
        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Team Track</a>
      </div>
      <div className="navbar-end">
        <UserMenu user={user} />
      </div>
    </div>
  )
}

export default Header