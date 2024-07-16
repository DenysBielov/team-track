'use client'

import { Position } from '@/lib/models/Position'
import React, { useState } from 'react'
import Image from "next/image"
import Loader from '@/components/Loader'
import { updatePayment } from '@/lib/requests/payments'
import { getPosition } from '@/lib/requests/positions'

function PaymentsList({ positions }: { positions: Position[] }) {
  return (
    positions.map((p, idx) => <PaymentPosition key={idx} defaultPosition={p} />)
  )
}

function PaymentPosition({ defaultPosition }: { defaultPosition: Position }) {
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [isLoading, setIsLoading] = useState<Boolean>(false)

  const changePaymentStatus = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const value = e.target.value
    updatePayment(position.id, value).then(() => {
      getPosition(position.id).then(pos => {
        console.log(pos)
        setPosition(pos)
        setIsLoading(false);
      })
    })
  }
  
  return (
    <div className="h-14 rounded-md bg-primary text-primary-content flex items-center p-4 justify-between relative">
      {isLoading && <Loader className="inset-0 text-neutral-50 absolute bg-black/55" />}
      <div className="flex items-center gap-2">
        <Image alt={position.user.name!} className='avatar rounded' src={position.user.image!} width={32} height={32} />
        <span className="font-bold">{position.user.name}</span>
      </div>
      <div>
        <select onChange={changePaymentStatus} className={`select select-sm w-full max-w-xs font-bold ${position.paid ? "badge-success" : "badge-error"}`}>
          <option className='bg-neutral-100' value="true" selected={position.paid}>Paid</option>
          <option className='bg-neutral-100' value="false" selected={!position.paid}>Not paid</option>
        </select>
      </div>
    </div>
  )
}

export default PaymentsList