import { loadEvent, loadEvents } from '@/lib/requests/events'
import moment from 'moment';
import { createTeam, loadTeams } from '@/lib/requests/teams';
import TeamsEditList from "@/components/Team/TeamsEditList"
import { notFound } from 'next/navigation';
import EventForm from '@/components/Event/EventForm';
import { loadLocations } from '@/lib/requests/locations';
import { FiPlus as PlusIcon } from "react-icons/fi"
import { Team } from '@/lib/models/Team';
import { Event } from "@/lib/models/Event";
import { useEffect, useState } from 'react';
import TeamsSection from './_components/TeamsSections';

async function EventEditPage({ params }: Params) {
  if (!params || !params.id) {
    notFound()
  }

  const event = await loadEvent(params.id)

  if (!event) {
    notFound()
  }
  const locations = await loadLocations();

  return (
    <div className='flex flex-col w-full gap-4'>
      <h1 className='text-2xl text-neutral-100 self-center'>{moment(event.date).format("DD MMMM, YYYY")}</h1>
      <EventForm event={event} locations={locations}>
        <button className='btn w-full text-neutral-100 btn-success'>Save</button>
      </EventForm>
      <div className='flex flex-col gap-4'>
        <span className='font-bold text-lg'>Edit Teams</span>
        <TeamsSection event={event}></TeamsSection>
      </div>
    </div>
  )
}



type Params = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const events = await loadEvents();

  return events.map(event => ({ id: event.id }));
}

export default EventEditPage