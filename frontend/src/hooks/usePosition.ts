import { useState } from 'react'
import { Position } from '@/lib/models/Position'
import { takePositionWithUser, releasePosition, getPosition } from '@/lib/requests/positions'
import { User } from 'next-auth'

export function usePosition(defaultPosition: Position, user: User | undefined) {
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const confirmPosition = () => {
    setIsConfirming(true)
  }

  const cancel = () => {
    setIsConfirming(false)
  }

  const takePosition = async () => {
    setIsConfirming(false)
    setIsLoading(true)
    try {
      const newPosition = await takePositionWithUser(position.id, user!.id!)
      setPosition(newPosition)
    } finally {
      setIsLoading(false)
    }
  }

  const leavePosition = async () => {
    setIsLoading(true)
    try {
      await releasePosition(position.id)
      const refreshedPosition = await getPosition(position.id)
      setPosition(refreshedPosition)
    } finally {
      setIsLoading(false)
    }
  }

  const assignPosition = async (user: User) => {
    if (!user.id) return

    setIsLoading(true)
    try {
      const newPosition = await takePositionWithUser(position.id, user.id!)
      setPosition(newPosition)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    position,
    isLoading,
    isConfirming,
    confirmPosition,
    cancel,
    assignPosition,
    takePosition,
    leavePosition
  }
}