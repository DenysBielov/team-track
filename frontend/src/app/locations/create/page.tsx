import React, { useState } from 'react'
import LocationForm from '@/components/Location/LocationForm'
import BackButton from '@/components/BackButton'

function AdminLocationsCreatePage() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex'>
        <BackButton/>
        <h2 className='text-center w-full'>Create Location</h2>
      </div>
      <LocationForm />
    </div>
  )
}

export default AdminLocationsCreatePage