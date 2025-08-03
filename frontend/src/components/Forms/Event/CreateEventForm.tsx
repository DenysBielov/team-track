'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateEvent, Location } from '@/lib/models/Event';
import { createEvent, createEvent as saveEventRequest } from '@/lib/requests/events';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event } from "@/lib/models/Event";
import 'react-datepicker/dist/react-datepicker.css';
import { getDuration, getFormattedDate } from '@/utils/dateUtils';
import { useMutation } from 'react-query';
import Loader from '../../Loader';
import { FaChevronLeft } from 'react-icons/fa6';

const schema = yup.object().shape({
  date: yup.date().required('Date is required').min(new Date(), 'Please choose future date'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required').test('is-greater', 'End time should be greater than start time', function (value) {
    const { startTime } = this.parent;
    const start = new Date(`01/01/2000 ${startTime}`).getTime();
    const end = new Date(`01/01/2000 ${value}`).getTime();
    const diff = end - start;

    return diff > 0;
  }),
  location: yup.string().required('Location is required'),
  name: yup.string().required('Name is required'),
  approveGuests: yup.boolean(),
  admins: yup.array().of(yup.object<User>().shape({
    id: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().required().email(),
  })),
  teamsNumber: yup.number().required('Number of teams is required').min(1, 'Number of teams should be greater than 0'),
  cost: yup.number().required('Cost is required').min(0, 'Cost should be non-negative'),
});

function CreateEventForm({ locations, event }: CreateEventFormProps) {
  const [step, setStep] = useState(1);

  const defaultLocation = event?.location || locations[0];

  const { control, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: event?.date,
      startTime: event?.startTime,
      endTime: event?.endTime,
      location: defaultLocation?.id,
      name: defaultLocation?.name,
      approveGuests: false,
      admins: [] as User[],
      teamsNumber: 3,
      cost: 0,
    }
  });

  const values = watch();

  useEffect(() => {
    if (user && !values.admins.find(a => a?.email === user?.email)) {
      setValue('admins', [...values.admins, user]);
    }
  }, [user]);

  const router = useRouter();
  const { mutate: submitEvent, isLoading, isError, error } = useMutation(async (eventData: CreateEvent) => {
    return await createEvent(eventData);
  });

  window.onpopstate = () => {
    setStep(step - 1);
  };

  const saveEvent = async (data: any) => {
    const event: CreateEvent = {
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      location: locations.find(l => l.id === data.location),
      name: data.name,
      approveGuests: data.approveGuests,
      admins: data.admins,
      teamsNumber: data.teamsNumber,
      cost: data.cost,
    };

    submitEvent(event, {
      onSuccess: () => {
        router.push("/events");
      },
    });
  };


  const nextStep = async () => {
    const stepValidationFields: { [key: number]: any[] } = {
      1: ["date"],
      2: ["startTime", "endTime"],
      3: ["location"],
      4: ["name", "teamsNumber", "cost"],
    };

    const isValid = await trigger(stepValidationFields[step]);

    if (isValid) {
      setStep(step + 1);
      router.push(`#step${step + 1}`);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      router.push(`#step${step - 1}`); // Update the URL with the previous step
    }
  };

  const getLocationName = (id: string) => {
    const location = locations.find(l => l.id === id);
    return location?.name;
  }

  const renderValues = () => {
    return (<div>
      {values.date && step > 1 && <div>📅 Date: {getFormattedDate(values.date)}</div>}
      {values.startTime && step > 2 && <div>⏰ Start time: {values.startTime}</div>}
      {values.endTime && step > 2 && <div>⏰ End time: {values.endTime}</div>}
      {values.endTime && values.startTime && step > 2 && <div>⏱️ Duration: {getDuration(values.startTime, values.endTime)}</div>}
      {values.location && step > 3 && <div>🗺️ Location: {getLocationName(values.location)}</div>}
    </div>);
  }

  return (
    <form className='form relative' onSubmit={handleSubmit(saveEvent)}>
      {isLoading && <Loader className="absolute inset-0 bg-black/55 -m-4" />}
      <div className='flex gap-2'>
        {step > 1 && <button type="button" className="btn btn-ghost btn-sm" onClick={prevStep}><FaChevronLeft /></button>}
        <h1 className='text-2xl font-bold'>Create Event</h1>
      </div>
      {isError && <p className="text-error">Something went wrong, we are working on it.</p>}
      {step === 1 && (
        <div className='flex flex-col gap-2'>
          <label className='font-bold'>Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <input {...field} className='input input-bordered w-full' type='date' />
            )}
          />
          {errors.date && <p className="text-error">{errors.date.message}</p>}
          <button type="button" className="btn btn-primary mt-4" onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <>
          {renderValues()}
          <div className='flex flex-col gap-2'>
            <label className='font-bold'>Start time</label>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <input {...field} className='input input-bordered w-full' type='time' />
              )}
            />
            {errors.startTime && <p className="text-error">{errors.startTime.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-bold'>End time</label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <input {...field} className='input input-bordered w-full' type='time' />
              )}
            />
            {errors.endTime && <p className="text-error">{errors.endTime.message}</p>}
            {values.startTime && values.endTime && <div className='font-bold'>Duration: {getDuration(values.startTime, values.endTime)}</div>}
            <button type="button" className="btn btn-primary mt-4" onClick={nextStep}>Next</button>
          </div>
        </>
      )}
      {step === 3 && (<>
        {renderValues()}
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <label className='font-bold'>Location</label>
            <Link href={"/locations/create"} className="link">Create new</Link>
          </div>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <select {...field} className='select select-bordered w-full'>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            )}
          />
          {errors.location && <p className="text-error">{errors.location.message}</p>}
          <button type="button" className="btn btn-primary mt-4" onClick={nextStep}>Next</button>
        </div></>
      )}
      {step === 4 && (
        <>
          {renderValues()}
          <div className='flex flex-col gap-2'>
            <label className='font-bold'>Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input {...field} className='input input-bordered w-full' type='text' />
              )}
            />
            {errors.name && <p className="text-error">{errors.name.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-bold'>Number of teams</label>
            <Controller
              name="teamsNumber"
              control={control}
              render={({ field }) => (
                <input {...field} className='input input-bordered w-full' type='number' />
              )}
            />
            {errors.teamsNumber && <p className="text-error">{errors.teamsNumber.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-bold'>Cost</label>
            <Controller
              name="cost"
              control={control}
              render={({ field }) => (
                <input {...field} className='input input-bordered w-full' type='number' />
              )}
            />
            {errors.cost && <p className="text-error">{errors.cost.message}</p>}
          </div>
          {/* <div className='flex gap-2'>
            <Controller
              name="approveGuests"
              control={control}
              render={({ field }) => (
                <input {...field} className='checkbox' type='checkbox' checked={values.approveGuests} />
              )}
            />
            <label className='font-bold'>Approve Guests</label>
            {errors.approveGuests && <p className="text-error">{errors.approveGuests.message}</p>}
          </div> */}
          <button type="submit" className="btn btn-primary mt-4">Submit</button>
        </>)
      }
    </form >
  );
}


type CreateEventFormProps = {
  locations: Location[],
  event?: Event,
} & React.PropsWithChildren;

export default CreateEventForm;