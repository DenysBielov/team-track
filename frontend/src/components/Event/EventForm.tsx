'use client'

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Location } from '@/lib/models/Event'
import { createEvent as saveEventRequest } from '@/lib/requests/events';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event } from "@/lib/models/Event"
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Image from "next/image"
import { User } from 'next-auth';

function EventForm({ locations, event, children }: EventFormProps) {
  const session = useSession();
  const user = session?.data?.user;

  const defaultLocation = event?.location || locations[0]

  const [values, setValues] = useState({
    date: event?.date ?? "",
    startTime: event?.startTime ?? "",
    endTime: event?.endTime ?? "",
    location: defaultLocation?.name ?? "",
    name: defaultLocation?.name,
    approveGuests: true,
    admins: [] as User[]
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    if (values.admins.find(a => a?.email == user?.email)) {
      return
    }

    setValues({
      ...values,
      admins: [...values.admins, user]
    })
  }, [user])

  const router = useRouter();

  const handleChange = (event: any) => {
    const name = event.target.name;

    let value = ""
    if (event.target.name === "location") {
      value = locations.find(l => l.id === event.target.value)!.name
    } else {
      value =
        event.target.type === "checkbox" ? event.target.checked : event.target.value;
    }

    let newValues = {
      ...values,
      [name]: value
    }

    const times = [newValues.startTime.substring(0, 5), newValues.endTime.substring(0, 5)].filter(value => value).join("-")

    newValues = {
      ...values,
      name: [newValues.location, newValues.date && moment(newValues.date).format("DD MMM YYYY"), times].filter(value => value).join(", "),
      [name]: value
    }

    setValues(newValues)
  }

  const listUsers = (event: any) => {
    console.log(event.target.value)
  }

  const saveEvent = async (formData: FormData) => {
    const event = {
      date: new Date(formData.get("date")?.toString()!),
      startTime: formData.get("startTime")?.toString()!,
      endTime: formData.get("endTime")?.toString()!,
      location: locations.find(l => l.id === formData.get("location"))!,
      name: values.name,
      approveGuests: values.approveGuests,
      admins: values.admins
    }

    await saveEventRequest(event);
    router.push("/admin/events")
  }
  console.log(values.admins)
  return (
    <form className='form' action={saveEvent}>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Date</label>
        <input name='date' className='input input-bordered w-full' type='date' value={moment(values.date).format("YYYY-MM-DD")} onChange={handleChange}></input>
      </div>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Start time</label>
        <input name='startTime' className='input input-bordered w-full' type='time' value={values.startTime} onChange={handleChange}></input>
      </div>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>End time</label>
        <input name='endTime' className='input input-bordered w-full' type='time' value={values.endTime} onChange={handleChange}></input>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <label className='font-bold'>Location</label>
          <Link href={"/admin/locations/create"} className="link">Create new</Link>
        </div>
        <select name="location" className='select select-bordered w-full' onChange={handleChange}>
          {locations.map(l => <option selected={values.location ? values.location == l.id : false} key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Name</label>
        <input name='name' className='input input-bordered w-full' type='text' value={values.name} onChange={handleChange}></input>
      </div>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Admins</label>
        {/* <input name='name' className='input input-bordered w-full' type='text' onChange={listUsers} placeholder='Start typing user name'></input> */}
        <div>
          {values.admins && values.admins.length > 0 ?
            values.admins.map(admin => {
              if (!admin) { return; }
              return <div key={admin?.id} className='bg-primary/90 text-primary-content rounded-md'>
                <div className='collapse-title p-4 h-14 rounded-md bg-primary w-full flex justify-between'>
                  <div className=' flex items-center gap-2'>
                    <Image alt={admin?.name!} className='avatar rounded' src={admin?.image!} width={32} height={32} />
                    <span>{admin?.name}</span>
                  </div>
                </div>
              </div>
            }
            ) :
            <div>No admins defined</div>
          }
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <input name='approveGuests' className='checkbox' type='checkbox' checked={values.approveGuests} onChange={handleChange}></input>
        <label className='font-bold'>Guests have to be approved</label>
      </div>
      {children}
    </form>
  )
}

type EventFormProps = {
  locations: Location[]
  event?: Event
} & PropsWithChildren

export default EventForm