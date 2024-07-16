'use client'

import React from 'react'
import { createPositionType as createPositionTypeRequest } from '@/lib/requests/positions';
import { useRouter } from 'next/navigation';

function PositionForm() {
  const router = useRouter();

  const createPositionType = async (formData: FormData) => {
    await createPositionTypeRequest(formData.get("name")?.toString()!);

    router.push("/admin/positions")
  }

  return (
    <form className='form' action={createPositionType}>
      <div className='flex flex-col gap-2'>
        <label className='font-bold'>Name</label>
        <input name='name' className='input input-bordered w-full' type='text'></input>
      </div>
      <button className='btn btn-success text-neutral-50 w-full'>Create</button>
    </form>
  )
}

export default PositionForm