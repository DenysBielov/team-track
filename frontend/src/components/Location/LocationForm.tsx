'use client'

import React, { useState } from 'react'
import { createLocation as createLocationRequest } from '@/lib/requests/locations'
import { useRouter } from 'next/navigation'
import Map from "@/components/Map/Map"
import { useDebounce } from '@/lib/hooks'

function LocationForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>()
  const [mapAddress, setMapAddress] = useState<string>()
  const [mapError, setMapError] = useState<string>()
  const [location, setLocation] = useState<google.maps.LatLng>()
  const setMapAddressDebounced = useDebounce(setMapAddress, 1000);

  const updateAddress = (address: string) => {
    setMapError("")
    setAddress(address)
    setMapAddressDebounced(address)
  }

  const router = useRouter()
  const createLocation = async (formData: FormData) => {
    setIsLoading(true)
    await createLocationRequest(
      {
        address: formData.get("address")?.toString()!,
        name: formData.get("name")?.toString()!,
        latLng: formData.get("location")?.toString()!
      })
    setIsLoading(false);
    router.back();
    router.refresh();
  }

  return (
    <form className='form' action={createLocation}>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Name</label>
        <input name='name' className='input input-bordered w-full'></input>
      </div>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Address</label>
        <input
          name='address'
          className='input input-bordered w-full'
          onChange={(e) => updateAddress(e.target.value)}
          value={address || ""}></input>
      </div>
      <input name='location' value={JSON.stringify(location || "")} type='hidden'></input>
      <div className='divider'>Or select on a map</div>
      <div className={`text-error ${mapError || "hidden"}`}>{mapError}</div>
      <Map onError={setMapError} onAddressSelected={setAddress} onLocationCalculated={setLocation} defaultAddress={mapAddress}></Map>
      <button className='btn btn-success text-neutral-100 w-full' disabled={isLoading}>{isLoading ? "Saving.." : "Create"}</button>
    </form>
  )
}

export default LocationForm