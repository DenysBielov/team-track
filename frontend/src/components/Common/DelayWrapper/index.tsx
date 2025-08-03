import React, { PropsWithChildren } from 'react'

type DelayWrapperProps = {
  timeInSeconds: number
  text: string
} & PropsWithChildren

function DelayWrapper({ children, timeInSeconds, text }: DelayWrapperProps) {
  
  return (
    
  )
}

export default DelayWrapper