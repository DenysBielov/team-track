import React from 'react'
import { FaCalendar, FaMoneyBill, FaMessage, FaPeopleGroup } from 'react-icons/fa6'

const links = [
  { name: 'Events', href: '/events', icon: FaCalendar },
  { name: 'Payments', href: '/payments', icon: FaMoneyBill },
  { name: 'Messages', href: '/messages', icon: FaMessage },
  { name: 'Groups', href: '/groups', icon: FaPeopleGroup },
]

function NavigationMenu() {
  return (
    <div className='sm:hidden h-20 fixed inset-x-0 bottom-0 shadow-black shadow-[rgba(0,0,15,0.25)_0px_-5px_50px_-20px] bg-neutral'>
      <nav className='flex justify-around gap-4 p-4'>
        {links.map(link => (
          <a key={link.name} href={link.href} className='flex flex-col items-center gap-1'>
            <link.icon size={24} className='text-primary'/>
            <span className='text-primary'>{link.name}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}

export default NavigationMenu