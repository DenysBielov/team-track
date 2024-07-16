import React, { PropsWithChildren } from 'react'
import { FiLock } from "react-icons/fi"

function BlockOverlay({ reason, className, children }: { reason: string, className?: string } & PropsWithChildren) {
  return (
    <div className={`absolute inset-0 bg-black/75 flex flex-col justify-center gap-4 items-center z-40  ${className}`}>
      <FiLock size={24}/>
      <span>{reason}</span>
      {children}
    </div>
  )
}

export default BlockOverlay