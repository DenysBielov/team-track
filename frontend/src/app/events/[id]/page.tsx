import React from 'react'
import { loadEvent, loadEvents } from '@/lib/requests/events'
import moment from 'moment';
import { loadTeams } from '@/lib/requests/teams';
import TeamsList from '../../../components/Team/TeamsList';
import { notFound, redirect } from 'next/navigation';
import Map from "@/components/Map/Map"
import Link from 'next/link';
import { auth } from '@/auth';
import { checkUserApproval } from '@/lib/requests/approvals';
import ApprovalSection from '../../../components/Event/ApprovalSection';
import EventMenu from '@/components/Event/EventMenu';
import Avatar from '@/components/Common/Avatar';

type EventPageParams = {
  params: {
    id: string;
  };
};

async function EventPage({ params }: EventPageParams) {
  if (!params || !params.id) {
    notFound()
  }

  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin")
  }

  // TODO: Too many requests
  const event = await loadEvent(params.id)

  if (!event) {
    notFound()
  }

  const isAdmin = !!event.admins.find(a => a.id == user.id);

  if (event.approveGuests && !isAdmin) {
    const userApproval = await checkUserApproval(event.id!, user?.id!)

    if (!userApproval || !userApproval.approved) {
      return <ApprovalSection defaultApproval={userApproval} userId={user?.id!} eventId={event.id!} />
    }
  }

  const teams = await loadTeams(params.id)

  teams.forEach(team => {
    team.event = event;
  });

  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl self-center'>{moment(event.date).format("DD MMMM, YYYY")}</h1>
          <span>from {event.startTime.substring(0, 5)} to {event.endTime.substring(0, 5)}</span>
        </div>
        <EventMenu event={event} />
      </div>
      {/* {isAdmin && event.approveGuests && <ApprovalRequestsSection eventId={event.id!} />} */}
      <div>
        <span className='text-xl font-bold'>Teams</span>
        <TeamsList teams={teams} />
      </div>
      <div>
        <span className='font-bold text-lg'>Location</span>
        <div className='flex flex-col gap-2 p-4 rounded-lg bg-primary/5'>
          <Map defaultAddress={event.location?.address} />
          <Link target='_blank' href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location.address)}`} className='btn w-full bg-primary text-primary-content'>Get Directions</Link>
          <div className='flex flex-col gap-2'>
            <span><b>Name:</b> {event.location?.name}</span>
            <span><b>Address:</b> {event.location?.address}</span>
          </div>
        </div>
      </div>
      <div>
        <span className='font-bold text-lg'>Admins</span>
        <div className='flex flex-col gap-2 p-4 rounded-lg bg-primary/5'>
          {event.admins.map(admin => (
            <div key={admin.id} className='flex items-center gap-2'>
              <Avatar profile={admin} />
              <span>{admin.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const events = await loadEvents();

  return events.map(event => ({ id: event.id }));
}


export default EventPage